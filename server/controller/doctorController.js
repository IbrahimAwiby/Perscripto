import Doctor from "../model/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

// ! API for changing doctor availability (Toggle)
export const changeDoctorAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Toggle availability
    doctor.available = !doctor.available;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor availability updated successfully",
      available: doctor.available,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! API for getting all doctors
export const getDoctorList = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .select("-password") // hide password
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: doctors.length,
      doctors,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! API for doctor login
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 2️⃣ Check if doctor exists
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 5️⃣ Remove password before sending response
    const doctorData = doctor.toObject();
    delete doctorData.password;

    res.status(200).json({
      success: true,
      token,
      doctor: doctorData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! API to get doctor profile (Protected)
export const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.docId; // From authDoctor middleware

    const doctor = await Doctor.findById(doctorId).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! API to update doctor profile (Protected)
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.docId;
    const {
      name,
      email,
      degree,
      experience,
      about,
      fees,
      speciality,
      address,
      available,
    } = req.body;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Validation
    if (name && name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (email && email !== doctor.email) {
      // Check if email is valid
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Check if email already exists
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      doctor.email = email;
    }

    // Update fields if provided
    if (name) doctor.name = name;
    if (degree) doctor.degree = degree;
    if (experience) doctor.experience = experience;
    if (about) doctor.about = about;
    if (fees) doctor.fees = fees;
    if (speciality) doctor.speciality = speciality;
    if (available !== undefined) doctor.available = available;

    // Handle address if provided
    if (address) {
      try {
        const parsedAddress =
          typeof address === "string" ? JSON.parse(address) : address;
        doctor.address = {
          line1: parsedAddress.line1 || doctor.address?.line1 || "",
          line2: parsedAddress.line2 || doctor.address?.line2 || "",
        };
      } catch (error) {
        console.error("Error parsing address:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid address format",
        });
      }
    }

    // Handle image upload if provided
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      doctor.image = upload.secure_url;
    }

    await doctor.save();

    // Return updated doctor without password
    const updatedDoctor = await Doctor.findById(doctorId).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.log("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
