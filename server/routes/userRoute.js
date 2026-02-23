import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  deleteAppointment,
  getUserAppointments,
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controller/userController.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authUser, getUserProfile);
userRouter.put(
  "/update-profile",
  authUser,
  upload.single("image"),
  updateUserProfile,
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/my-appointments", authUser, getUserAppointments);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/delete-appointment", authUser, deleteAppointment);

export default userRouter;
