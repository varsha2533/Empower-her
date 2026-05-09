import express from "express";
import axios from "axios";
import SOSAlert from "../models/SOSAlert.js";
import twilio from "twilio";

const router = express.Router();

/**
 * Helper function to initialize and return Twilio client
 * Returns null if Twilio credentials are not configured (development mode)
 */
function getTwilioClient() {
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!twilioSid || !twilioToken || !twilioPhone) {
    console.error('Missing Twilio configuration:', {
      sid: !!twilioSid,
      token: !!twilioToken,
      phone: !!twilioPhone,
    });
    return null;
  }

  return twilio(twilioSid, twilioToken);
}

/**
 * Test Route - Verify SOS endpoint is working
 * GET /api/sos/test
 */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "SOS route working",
  });
});

/**
 * POST /api/sos
 * Main SOS Alert Endpoint
 * 
 * Workflow:
 * 1. Validate incoming contacts
 * 2. Save alert to MongoDB
 * 3. Send SMS to all contacts via Twilio (or simulate in dev mode)
 * 4. Call FastAPI risk engine for risk assessment
 * 5. Save risk data and return to client
 * 
 * Request body:
 * {
 *   contacts: [{name, phone}, ...],
 *   location: {lat, lng},
 *   message: string (optional)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   alert: {...},
 *   riskData: {riskScore, riskLevel, recommendation}
 * }
 */
router.post("/", async (req, res) => {
  let alert;

  try {
    const { contacts, location, message, userId } = req.body;
    
    // Validate userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    
    const alertMessage = typeof message === 'string' && message.trim().length > 0
      ? message.trim()
      : '🚨 Emergency SOS Alert';

    // Validation - location is optional now
    if (!contacts || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Contacts are required",
      });
    }

    const client = getTwilioClient();
    if (!client) {
      console.warn('Twilio not configured - running in development mode');
    }

    // Step 1: Save alert in MongoDB with userId
    alert = await SOSAlert.create({
      userId,
      contacts,
      location: location || null, // Allow null location
      message: alertMessage,
      smsStatus: "pending",
    });

    // Step 2: Send SMS to all contacts (or simulate in development)
    for (const contact of contacts) {
      const locationText = location && location.lat !== 0 && location.lng !== 0
        ? `\n\nLocation:\nhttps://maps.google.com/?q=${location.lat},${location.lng}`
        : '\n\nLocation: Not available (permission denied)';

      if (client) {
        // Send real SMS via Twilio
        await client.messages.create({
          body: `
🚨 SOS ALERT 🚨

A user may be in danger.${locationText}

Message:
${alertMessage}
          `,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contact.phone,
        });
      } else {
        // Simulate SMS sending in development
        console.log(`[DEV MODE] Would send SMS to ${contact.name} (${contact.phone}):`);
        console.log(`🚨 SOS ALERT 🚨

A user may be in danger.${locationText}

Message:
${alertMessage}`);
      }
    }

    // Update SMS status
    alert.smsStatus = client ? "sent" : "simulated";
    await alert.save();

    // Step 3: Get risk assessment from FastAPI (with fallback)
    let riskData = {
      riskScore: 0,
      riskLevel: "LOW",
      recommendation: "FastAPI risk engine unavailable. Proceed with caution.",
    };

    try {
      const response = await axios.post("http://localhost:8000/risk-score", {
        message: alertMessage,
        location,
      });

      const data = response.data || {};
      riskData = {
        riskScore: typeof data.riskScore === "number" ? data.riskScore : riskData.riskScore,
        riskLevel: data.riskLevel || riskData.riskLevel,
        recommendation: data.recommendation || riskData.recommendation,
      };
    } catch (error) {
      console.warn("FastAPI risk engine unavailable:", error.message || error);
    }

    // Step 4: Save risk data to alert
    alert.riskScore = riskData.riskScore;
    alert.riskLevel = riskData.riskLevel;
    alert.recommendation = riskData.recommendation;
    await alert.save();

    // Step 5: Return success response with risk data
    res.status(201).json({
      success: true,
      message: client ? "SOS alert sent successfully" : "SOS alert saved (SMS simulated in development)",
      alert,
      riskData,
    });

  } catch (err) {
    console.error("SOS Error:", err);

    // Update failed status if alert exists
    if (alert) {
      alert.smsStatus = "failed";
      await alert.save();
    }

    res.status(500).json({
      success: false,
      message: "Failed to send SOS alert",
      error: err.message,
    });
  }
});

/**
 * GET /api/sos/history
 * Fetch SOS Alert History
 * 
 * Returns latest alerts sorted by newest first
 * Supports pagination via query parameters:
 * - limit: number of alerts to return (default: 50)
 * - skip: number of alerts to skip (default: 0)
 * 
 * Response:
 * {
 *   success: boolean,
 *   alerts: [...],
 *   pagination: {total, limit, skip, hasMore}
 * }
 */
router.get("/history", async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Validate userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    
    const limit = parseInt(req.query.limit) || 50; // Default to 50 alerts
    const skip = parseInt(req.query.skip) || 0;

    // Fetch alerts for specific user, sorted by newest first, with pagination
    const alerts = await SOSAlert.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await SOSAlert.countDocuments({ userId });

    res.json({
      success: true,
      alerts,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    });
  } catch (err) {
    console.error("SOS History Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch SOS history",
      error: err.message,
    });
  }
});

// IMPORTANT: Export router
export default router;