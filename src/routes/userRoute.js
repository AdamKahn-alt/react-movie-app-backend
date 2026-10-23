import { Router } from "express";
import {
  createUser,
  deleteUserById,
  forgotPassword,
  loginUser,
  logout,
  resetPassword,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeEachUser } from "../middlewares/authorize.js";

const router = Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.delete("/delete/:id", authenticate, authorizeEachUser, deleteUserById);

export default router;

// router.get("/route", (req, res) => {
//   res.status(200).json({ success: true, message: "User route is working" });
// });
