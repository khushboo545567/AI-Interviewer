import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectdb.js";
import authRouter from "./routers/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  return res.json({ server: "hyyyyy" });
});

app.use("/api/v1/user", authRouter);

// DB Connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
