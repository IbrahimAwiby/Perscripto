import express from "express";
import {
  addDoctor,
  getAllDoctors,
  loginAdmin,
} from "../controller/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeDoctorAvailability } from "../controller/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/doctors-list", authAdmin, getAllDoctors);
adminRouter.patch("/change-availability", authAdmin, changeDoctorAvailability);

export default adminRouter;
