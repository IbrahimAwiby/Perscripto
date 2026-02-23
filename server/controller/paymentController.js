// controllers/paymentController.js
import axios from "axios";
import crypto from "crypto";
import Appointment from "../model/Appointment.js";

// Paymob Configuration
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET;

// Helper function to split name
const splitName = (fullName) => {
  if (!fullName) return { first_name: "Patient", last_name: "User" };

  const nameParts = fullName.trim().split(" ");

  if (nameParts.length === 1) {
    return {
      first_name: nameParts[0],
      last_name: "User",
    };
  }

  return {
    first_name: nameParts[0],
    last_name: nameParts.slice(1).join(" "),
  };
};

// ! API to Get Paymob Authentication Token
export const getAuthToken = async () => {
  try {
    console.log("Requesting Paymob auth token...");
    const response = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key: PAYMOB_API_KEY,
      },
    );
    console.log("Auth token received successfully");
    return response.data.token;
  } catch (error) {
    console.error(
      "Error getting Paymob token:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ! API to Create Payment Order
export const createPaymentOrder = async (req, res) => {
  try {
    console.log("Creating payment order for appointment:", req.body);
    const { appointmentId } = req.body;
    const userId = req.userId;

    // Find appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      console.log("Appointment not found:", appointmentId);
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    console.log("Appointment found:", appointment._id);

    // Verify appointment belongs to user
    if (appointment.userId !== userId) {
      console.log("Unauthorized: User doesn't own this appointment");
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if already paid
    if (appointment.payment) {
      console.log("Appointment already paid");
      return res.status(400).json({
        success: false,
        message: "Appointment already paid",
      });
    }

    // Check if cancelled
    if (appointment.cancelled) {
      console.log("Cannot pay for cancelled appointment");
      return res.status(400).json({
        success: false,
        message: "Cannot pay for cancelled appointment",
      });
    }

    // Get auth token
    const authToken = await getAuthToken();

    // Calculate amount in cents (ensure it's an integer)
    const amountInCents = Math.round(appointment.amount * 100);

    // Create order
    console.log("Creating Paymob order...");
    const orderResponse = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amountInCents,
        currency: "EGP",
        items: [
          {
            name: `Appointment with Dr. ${appointment.docData.name}`,
            amount_cents: amountInCents,
            description: `Medical appointment on ${appointment.slotDate} at ${appointment.slotTime}`,
            quantity: 1,
          },
        ],
      },
    );

    const orderId = orderResponse.data.id;
    console.log("Order created with ID:", orderId);

    // Split name into first and last
    const { first_name, last_name } = splitName(appointment.userData?.name);

    // Create payment key with all required fields
    console.log("Creating payment key...");
    const paymentKeyResponse = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: authToken,
        amount_cents: amountInCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: appointment.userData?.email || "patient@example.com",
          floor: "NA",
          first_name: first_name,
          last_name: last_name,
          street: "NA",
          building: "NA",
          phone_number: appointment.userData?.phone || "01000000000",
          city: "Cairo",
          country: "EG",
          state: "NA",
          postal_code: "NA",
          extra_description: "NA",
        },
        currency: "EGP",
        integration_id: parseInt(PAYMOB_INTEGRATION_ID),
        lock_order_when_paid: "false",
      },
    );

    const paymentKey = paymentKeyResponse.data.token;
    console.log("Payment key created successfully");

    // Save order ID to appointment
    appointment.paymobOrderId = orderId;
    await appointment.save();
    console.log("Order ID saved to appointment");

    res.status(200).json({
      success: true,
      paymentKey,
      orderId,
      iframeId: PAYMOB_IFRAME_ID,
      amount: appointment.amount,
    });
  } catch (error) {
    console.error("Payment order error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
      details: error.response?.data || null,
    });
  }
};

// ! API to Handle Paymob Callback (Webhook)
export const handlePaymentCallback = async (req, res) => {
  try {
    const data = req.body;
    console.log("Paymob Callback Data:", JSON.stringify(data, null, 2));

    // Get the transaction object (could be in data.obj or directly in data)
    const transaction = data.obj || data;

    // Get order ID from transaction
    const orderId = transaction.order?.id || transaction.order_id;

    if (!orderId) {
      console.log("No order ID in callback");
      return res.status(400).json({ success: false, message: "No order ID" });
    }

    // Find appointment by paymobOrderId
    const appointment = await Appointment.findOne({ paymobOrderId: orderId });

    if (!appointment) {
      console.log("Appointment not found for order:", orderId);
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Check if payment was successful
    if (transaction.success === true) {
      // Update appointment payment status to true
      appointment.payment = true;
      appointment.paymobTransactionId = transaction.id;
      appointment.paymobPaymentData = transaction;

      // Optional: Add payment timestamp
      appointment.paidAt = new Date();

      await appointment.save();

      console.log(`✅ Payment successful for appointment: ${appointment._id}`);
      console.log(`💰 Amount: ${appointment.amount} EGP`);
      console.log(
        `📅 Appointment date: ${appointment.slotDate} at ${appointment.slotTime}`,
      );
    } else {
      console.log(`❌ Payment failed for order: ${orderId}`);
      console.log("Failure reason:", transaction.data?.message || "Unknown");

      // Optional: Store failed payment attempt
      appointment.paymentAttempts = appointment.paymentAttempts || [];
      appointment.paymentAttempts.push({
        date: new Date(),
        success: false,
        transactionId: transaction.id,
        data: transaction,
      });
      await appointment.save();
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({
      success: true,
      message: "Callback received successfully",
    });
  } catch (error) {
    console.error("Callback error:", error);
    // Still return 200 to prevent Paymob from retrying
    res.status(200).json({
      success: false,
      message: "Error processing callback",
      error: error.message,
    });
  }
};

// ! API to Handle Payment Response (Return URL)
export const handlePaymentResponse = async (req, res) => {
  try {
    const { success, orderId, transaction_id } = req.query;
    console.log("Payment response:", { success, orderId, transaction_id });

    if (success === "true" && orderId) {
      // Try to update appointment payment status if needed
      try {
        const appointment = await Appointment.findOne({
          paymobOrderId: orderId,
        });
        if (appointment && !appointment.payment) {
          // If callback hasn't processed yet, update payment status
          appointment.payment = true;
          appointment.paymobTransactionId = transaction_id;
          appointment.paidAt = new Date();
          await appointment.save();
          console.log(
            `✅ Payment status updated from response for appointment: ${appointment._id}`,
          );
        }
      } catch (updateError) {
        console.error("Error updating appointment from response:", updateError);
      }

      // Redirect to success page
      res.redirect(
        `${process.env.FRONTEND_URL}/payment-success?orderId=${orderId}`,
      );
    } else {
      // Redirect to failure page
      res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }
  } catch (error) {
    console.error("Response error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

// ! API to Check Payment Status
export const getPaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.userId;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.userId !== userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      payment: appointment.payment,
      paymobOrderId: appointment.paymobOrderId,
      paymobTransactionId: appointment.paymobTransactionId,
      paidAt: appointment.paidAt,
    });
  } catch (error) {
    console.error("Payment status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
