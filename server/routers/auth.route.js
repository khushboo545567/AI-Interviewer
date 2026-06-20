import express from "express";
import { googleAuth, logOut } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/google-auth", googleAuth);
authRouter.post("/logout", logOut);
export default authRouter;
