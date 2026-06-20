import express from "express";
import getCurrentUser from "../controllers/user.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const userRoute = express.Router();

userRoute.get("/get-current-user", verifyToken, getCurrentUser);

export default userRoute;
