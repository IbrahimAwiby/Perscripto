import jwt from "jsonwebtoken";

// Protect Middleware (Admin Only)
const authAdmin = (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: check if admin
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    req.admin = decoded; // attach admin info to request
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export default authAdmin;
