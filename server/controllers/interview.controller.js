import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.services.js";
import userModel from "../models/user.modle.js";
import interviewModel from "../models/interview.model.js";

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filePath = req.file.path;

    // READ FILE
    const fileBuffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(fileBuffer);
    // EXTRACT TEXT FROM PDF
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    console.log(pdf);

    let resumeText = "";

    // LOOPS THROUGH all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();
    console.log("resumeText", resumeText);

    // SEND RESUME TO LLM
    const messages = [
      {
        role: "system",
        content: `Extract structured data from resume.

            Return strictly JSON:
            {
            "role":"string",
            "experience":"string",
            "projects":["project1","project2"],
            "skills":["skill1","skill2"]
            }
            `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    // LLM RETURNS JSON
    const aiResponse = await askAi(messages);
    const cleanResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    console.log("aiResponse", aiResponse);
    // CONVERT STRING TO OBJECT
    const parsed = JSON.parse(cleanResponse);
    console.log("parsed", parsed);
    fs.unlinkSync(filePath);

    // RETURN TO FRONTEND
    res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.log(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

const generateQues = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({
        message: "role, experience, mode are required",
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 credits required",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
Role: ${role}
Experience: ${experience}
Interview Mode: ${mode}
Projects: ${projectText}
Skills: ${skillsText}
Resume: ${safeResume}
`;

    const messages = [
      {
        role: "system",
        content: `
You are an experienced professional interviewer conducting a realistic mock interview.

Your task is to generate EXACTLY 5 interview questions.

IMPORTANT RULES:
- Return ONLY the questions.
- Do NOT add numbering.
- Do NOT add bullet points.
- Do NOT add explanations or headings.
- Write exactly one question per line.
- Each question must be a single sentence.
- Each question must contain 15 to 25 words.
- Use simple, natural, conversational English.
- Questions must sound realistic and professional.
- Avoid generic textbook questions.
- Tailor questions using the candidate's:
  - role
  - experience
  - skills
  - projects
  - resume details
  - interview mode

DIFFICULTY ORDER:
1. Easy
2. Easy
3. Medium
4. Medium
5. Hard

For Technical interviews:
- Ask practical technical and problem-solving questions.

For HR interviews:
- Ask behavioral, communication, teamwork, leadership, and situational questions.

Generate only the questions.
`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const airesponse = await askAi(messages);

    if (!airesponse || !airesponse.trim()) {
      return res.status(500).json({
        message: "AI returned empty response",
      });
    }

    const questionArray = airesponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 5);

    if (questionArray.length === 0) {
      return res.status(500).json({
        message: "AI failed to generate questions",
      });
    }

    user.credits -= 50;
    await user.save();

    const interview = await interviewModel.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,

      questions: questionArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    return res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await interviewModel.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    const question = interview.questions[questionIndex];

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // empty answer
    if (!answer || !answer.trim()) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      return res.json({
        feedback: question.feedback,
      });
    }

    // time exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer was not evaluated.";

      question.answer = answer;

      await interview.save();

      return res.json({
        feedback: question.feedback,
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate answer in a realistic interview.

Evaluate fairly and naturally.

Score the answer from 0 to 10 in these areas:

1. confidence
- Does the answer sound confident and well-presented?

2. communication
- Is the answer clear and easy to understand?

3. correctness
- Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- Weak answers should receive low scores.
- Strong detailed answers should receive high scores.
- Consider clarity, structure, confidence, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness rounded to nearest whole number.

Feedback Rules:
- Write natural human interview feedback.
- Use only 10 to 15 words.
- Sound professional and realistic.
- Suggest improvement if needed.
- Do not explain scoring.
- Do not repeat the question.

Return ONLY valid JSON in this exact format:

{
  "confidence": 0,
  "communication": 0,
  "correctness": 0,
  "finalScore": 0,
  "feedback": ""
}
`,
      },
      {
        role: "user",
        content: `
Question: ${question.question}

Answer: ${answer}
`,
      },
    ];

    const airesponse = await askAi(messages);

    const parsed = JSON.parse(airesponse);

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({
      feedback: parsed.feedback,
      score: parsed.finalScore,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to submit answer: ${error.message}`,
    });
  }
};

const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await interviewModel.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Failed to find interview",
      });
    }

    const totalQuestion = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestion ? totalScore / totalQuestion : 0;

    const avgConfidence = totalQuestion ? totalConfidence / totalQuestion : 0;

    const avgCommunication = totalQuestion
      ? totalCommunication / totalQuestion
      : 0;

    const avgCorrectness = totalQuestion ? totalCorrectness / totalQuestion : 0;

    interview.finalScore = Number(finalScore.toFixed(1));

    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),

      confidence: Number(avgConfidence.toFixed(1)),

      communication: Number(avgCommunication.toFixed(1)),

      correctness: Number(avgCorrectness.toFixed(1)),

      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,

        score: q.score || 0,

        feedback: q.feedback || "",

        confidence: q.confidence || 0,

        communication: q.communication || 0,

        correctness: q.correctness || 0,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to finish interview: ${error.message}`,
    });
  }
};

export { analyzeResume, generateQues, submitAnswer, finishInterview };
