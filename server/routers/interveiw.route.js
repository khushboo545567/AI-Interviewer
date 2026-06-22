import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { analyzeResume } from "../controllers/interview.controller.js";
import { upload } from "../middleware/multer.js";

const interviewRouter = express.Router();
interviewRouter.post(
  "/resume-analyzer",
  verifyToken,
  upload.single("resume"),
  analyzeResume,
);

export default interviewRouter;
