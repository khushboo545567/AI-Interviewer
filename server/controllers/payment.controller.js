import paymentModel from "../models/payment.model";
import razorpay from "../services/razorpay.service";

const createOrder = async (req, res) => {
  try {
    const { planId, amount, credits } = req.body;
    if (!amount || !credits) {
      return res.status(400).json({ message: "Invalid plan data" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await paymentModel.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });
    return res.json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to create razorpay order ${error}` });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha26", process.env.ROZARPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    //   check if the payment is valid or not
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to create razorpay order ${error}` });
  }
};
