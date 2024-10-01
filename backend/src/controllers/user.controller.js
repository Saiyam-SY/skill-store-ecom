import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const createdUser = new User({
      fullName: fullName,
      email: email,
      password: hashPassword,
    });
     createdUser.save();
    res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: createdUser._id,
        fullName: createdUser.fullName,
        email: createdUser.email,
      },
    });
  } catch (err) {
    if (err.response) {
      console.log(err);
      alert("Error : " + err.response.data.message);
    }
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    } else {
      res.status(200).json({
        message: "Login Successful",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      });
    }
  } catch (error) {
    console.log("Error :  " + error.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
