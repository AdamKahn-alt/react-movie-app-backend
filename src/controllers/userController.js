import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { publicUser } from "../services/publicUser.js";
import { signToken } from "../middlewares/jwt.js";
import { sendWelcomeEmail } from "../services/emailService.js";
import {
  forgotPasswordService,
  resetUserPasswordService,
} from "../services/passwordResetService.js";

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing values",
    });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const user = { username: newUser.username, email: newUser.email };
    const isSent = await sendWelcomeEmail(user);

    if (isSent === false) {
      return res.status(201).json({
        success: true,
        message:
          "New user created successfully, but welcome email failed to send",
        data: {
          user: publicUser(newUser),
          welcomeEmailSent: false,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "New User created successfully",
      data: {
        user: publicUser(newUser),
        welcomeEmailSent: true,
      },
    });
  } catch (error) {
    console.error(`failed due to error: ${error}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing Credentials",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = await signToken(payload, {
      expiresIn: "20m",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 3600000, // 1 hour,
      path: "/",
    });
    // console.log("token below");
    // console.log(token);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: publicUser(user),
      },
    });
  } catch (error) {
    console.error(`failed due to error: ${error}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUserById = async (req, res) => {
  const id = req.params.id;
  // console.log("id below");
  // console.log(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: `User with id ${id} not found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        user: publicUser(deletedUser),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `failed due to error: ${error}`,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 3600000, // 1 hour,
    path: "/",
  });
  res.status(204).send();
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await forgotPasswordService(email);
    return res.status(200).json({
      success: true,
      message: user.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const updatedUser = await resetUserPasswordService(newPassword, token);
    return res.status(200).json({
      success: true,
      message: `Password reset successful for user ${updatedUser.username}`,
      data: {
        user: publicUser(updatedUser),
      },
    });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    return res.status(error.statusCode || 500).json({
      success: false,
      message: `failed due to error: ${error}`,
    });
  }
};
