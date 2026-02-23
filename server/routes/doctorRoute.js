import express from "express";
import {
  getDoctorList,
  getDoctorProfile,
  loginDoctor,
  updateDoctorProfile,
} from "../controller/doctorController.js";
import upload from "../middleware/multer.js";
import authDoctor from "../middleware/authDoctor.js";

const doctorRouter = express.Router();

// Public routes
doctorRouter.get("/list", getDoctorList);
doctorRouter.post("/login", loginDoctor);

// Protected routes (require doctor authentication)
doctorRouter.get("/profile", authDoctor, getDoctorProfile);
doctorRouter.put(
  "/update-profile",
  authDoctor,
  upload.single("image"),
  updateDoctorProfile,
);

export default doctorRouter;
