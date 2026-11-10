import { Router } from "express";
import {
  createUser,
  createWatchList,
  deleteUserById,
  deleteWatchListMedia,
  fetchMe,
  fetchProfile,
  forgotPassword,
  loginUser,
  logout,
  resetPassword,
  viewAllWatchList,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeEachUser } from "../middlewares/authorize.js";

const router = Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, fetchMe);
router.get("/fetch-profile", authenticate, fetchProfile);
router.delete("/delete/:id", authenticate, authorizeEachUser, deleteUserById);

// WATCHLIST ROUTES
router.post("/add-to-watchlist", authenticate, createWatchList);
router.get("/view-watchlists", authenticate, viewAllWatchList);
router.delete("/delete-watchlist/:tmdbId", authenticate, deleteWatchListMedia);

export default router;

// router.get("/route", (req, res) => {
//   res.status(200).json({ success: true, message: "User route is working" });
// });
