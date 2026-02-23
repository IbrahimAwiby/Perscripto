import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import cloudinary from "../config/cloudinary.js";
import Doctor from "../model/Doctor.js";
import Appointment from "../model/Appointment.js";

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ! API to register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! API to login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! API to get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! API to Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { name, phone, gender, dob, address } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validation
    if (name && name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (
      phone &&
      phone !== "00000000000" &&
      !validator.isMobilePhone(phone.toString())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (gender && !["Male", "Female", "Not Selected"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender value",
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;

    // Handle address - IMPORTANT: Parse the address if it's a string
    if (address) {
      try {
        // If address is a string, parse it
        const parsedAddress =
          typeof address === "string" ? JSON.parse(address) : address;

        user.address = {
          line1: parsedAddress.line1 || user.address?.line1 || "",
          line2: parsedAddress.line2 || user.address?.line2 || "",
        };
      } catch (error) {
        console.error("Error parsing address:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid address format",
        });
      }
    }

    // Handle image upload
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      user.image = upload.secure_url;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// ! API to Book Appointment
export const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await Doctor.findById(docId).select("-password");

    if (!docData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    // checking for slot availablity
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await User.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();

    // save new slots data in doctor data
    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully🎉",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! API to Get All Appointments for Logged-in User
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.userId;

    const appointments = await Appointment.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ! API to Cancel Appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify that the appointment belongs to the user
    if (appointment.userId !== userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized to cancel this appointment",
      });
    }

    // Update appointment status
    appointment.cancelled = true;
    await appointment.save();

    // Remove the slot from doctor's slots_booked
    const doctor = await Doctor.findById(appointment.docId);
    if (doctor) {
      const slots_booked = doctor.slots_booked;
      const slotDate = appointment.slotDate;
      const slotTime = appointment.slotTime;

      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(
          (time) => time !== slotTime,
        );

        // Remove the date if no slots left
        if (slots_booked[slotDate].length === 0) {
          delete slots_booked[slotDate];
        }

        await Doctor.findByIdAndUpdate(appointment.docId, { slots_booked });
      }
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! API to Permanently Delete Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify that the appointment belongs to the user
    if (appointment.userId !== userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized to delete this appointment",
      });
    }

    // Only allow deletion of cancelled appointments
    if (!appointment.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Only cancelled appointments can be deleted",
      });
    }

    // Permanently delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);

    res.status(200).json({
      success: true,
      message: "Appointment deleted permanently",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// // ! API to make payment of appointment using razorpay
// export const paymentRazorpay = async (req, res) => {
  
// }
