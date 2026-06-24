// import mongoose from "mongoose";

// const questionSchema = new mongoose.Schema({
//   question: String,
//   difficulty: String,
//   timeLimit: Number,
//   answer: String,
//   feedback: String,
//   score: { type: Number, default: 0 },
//   confidence: { type: Number, default: 0 },
//   communication: { type: Number, default: 0 },
//   currectness: { type: Number, default: 0 },
// });

// const interviewSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },
//     role: { type: String, required: true },
//     experience: { type: String, required: true },
//     mode: { type: String, enum: ["HR", "Technical"], required: true },
//     resumeText: { type: String },
//     question: [questionSchema],
//     finalScore: { type: Number, default: 0 },
//     status: {
//       type: String,
//       enum: ["incomplete", "completed"],
//       default: "incompleted",
//     },
//   },

//   { timestamps: true },
// );

// const interviewModel =
//   mongoose.models.interview || mongoose.model("interview", interviewSchema);

// export default interviewModel;

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },

  timeLimit: {
    type: Number,
    default: 60,
  },

  answer: {
    type: String,
    default: "",
  },

  feedback: {
    type: String,
    default: "",
  },

  score: {
    type: Number,
    default: 0,
  },

  confidence: {
    type: Number,
    default: 0,
  },

  communication: {
    type: Number,
    default: 0,
  },

  correctness: {
    type: Number,
    default: 0,
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      enum: ["HR", "Technical"],
      required: true,
    },

    resumeText: {
      type: String,
      default: "",
    },

    questions: [questionSchema],

    finalScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
  },
  { timestamps: true },
);

interviewSchema.index({ userId: 1 });
interviewSchema.index({ status: 1 });

const interviewModel =
  mongoose.models.interview || mongoose.model("interview", interviewSchema);

export default interviewModel;
