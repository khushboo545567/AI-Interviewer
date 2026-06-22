import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectdb.js";
import authRouter from "./routers/auth.route.js";
import userRoute from "./routers/user.route.js";
import interviewRouter from "./routers/interveiw.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  return res.json({ server: "hyyyyy" });
});

app.use("/api/v1/user/auth", authRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/interview", interviewRouter);

// DB Connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
