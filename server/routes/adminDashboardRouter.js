// routes/adminDashboardRouter.js
import express from "express";
import {
  getDashboardStats,
  getMonthlyTrends,
  getTopDoctors
} from "../controller/adminDashboardController.js";
import authAdmin from "../middleware/authAdmin.js";

const adminDashboardRouter = express.Router();

// All routes require admin authentication
adminDashboardRouter.use(authAdmin);

// Get all dashboard statistics
adminDashboardRouter.get("/stats", getDashboardStats);

// Get monthly trends for charts
adminDashboardRouter.get("/trends", getMonthlyTrends);

// Get top performing doctors
adminDashboardRouter.get("/top-doctors", getTopDoctors);

export default adminDashboardRouter;