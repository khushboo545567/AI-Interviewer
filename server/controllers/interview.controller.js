import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.services.js";

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

export { analyzeResume };
