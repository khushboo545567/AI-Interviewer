import userModel from "../models/user.modle.js";
import genToken from "../config/token.js";

const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({ name, email });
    }

    const jwttoken = await genToken(user._id);

    res.cookie("token", jwttoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `google auth error: ${error.message}` });
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error occurred while logout: ${error.message}`,
    });
  }
};
export { googleAuth, logOut };
