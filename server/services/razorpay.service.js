import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.ROZARPAY_KEY_ID,
  key_secret: process.env.ROZARPAY_KEY_SECRET,
});
export default razorpay;
