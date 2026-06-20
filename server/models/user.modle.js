import mongoose from "mongoose";

const userShema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true, unique: true },
    credits: { type: Number, default: 100 },
  },
  { timestamps: true },
);

const userModel = mongoose.models.user || mongoose.model("user", userShema);

export default userModel;
