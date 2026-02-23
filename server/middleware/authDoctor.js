// middleware/authDoctor.js
import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login as doctor.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach doctor information to request object
    req.docId = decoded.docId || decoded.id;
    req.doctor = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token. Please login again.",
    });
  }
};

export default authDoctor;
