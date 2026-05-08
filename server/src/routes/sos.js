import express from "express";
import SOSAlert from "../models/SOSAlert.js";
import twilio from "twilio";

const router = express.Router();

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

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "SOS route working",
  });
});

// SOS Route
router.post("/", async (req, res) => {
  let alert;

  try {
    const { contacts, location, message } = req.body;

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

    // Save alert in MongoDB
    alert = await SOSAlert.create({
      contacts,
      location: location || null, // Allow null location
      message,
      smsStatus: "pending",
    });

    // Send SMS to all contacts (or simulate in development)
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
${message || "Emergency SOS triggered"}
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
${message || "Emergency SOS triggered"}`);
      }
    }

    // Update SMS status
    alert.smsStatus = client ? "sent" : "simulated";
    await alert.save();

    res.status(201).json({
      success: true,
      message: client ? "SOS alert sent successfully" : "SOS alert saved (SMS simulated in development)",
      alert,
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

// IMPORTANT: Export router
export default router;