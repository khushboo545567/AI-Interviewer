import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import {
  analyzeResume,
  finishInterview,
  generateQues,
  getInterview,
  getInterviewHistory,
  submitAnswer,
} from "../controllers/interview.controller.js";
import { upload } from "../middleware/multer.js";

const interviewRouter = express.Router();
interviewRouter.post(
  "/resume-analyzer",
  verifyToken,
  upload.single("resume"),
  analyzeResume,
);

interviewRouter.post("/generate-questions", verifyToken, generateQues);

interviewRouter.post("/submit-answer", verifyToken, submitAnswer);

interviewRouter.post("/finish", verifyToken, finishInterview);

interviewRouter.get("/get-history-interview", verifyToken, getInterviewHistory);

interviewRouter.get("/get-interview/:id", verifyToken, getInterview);
export default interviewRouter;
