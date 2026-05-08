import { Router } from "express";
import twilio from "twilio";

const router = Router();

function getTwilioClient() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return null;
  }

  return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

function validateIndianPhone(phone) {
  const cleanedPhone = String(phone || "").replace(/\s+/g, "");
  const phoneRegex = /^\+91[6-9]\d{9}$/;

  return {
    cleanedPhone,
    isValid: phoneRegex.test(cleanedPhone),
  };
}

router.post("/send-sms", async (req, res) => {
  const { to, message } = req.body || {};

  if (!to || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
      details: {
        to: to ? "present" : "missing",
        message: message ? "present" : "missing",
      },
    });
  }

  const { cleanedPhone, isValid } = validateIndianPhone(to);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid Indian phone number format",
      details: {
        received: cleanedPhone,
        expected: "+91 followed by 10 digits",
      },
    });
  }

  const { TWILIO_PHONE_NUMBER } = process.env;
  const twilioClient = getTwilioClient();

  if (!twilioClient || !TWILIO_PHONE_NUMBER) {
    return res.status(500).json({
      success: false,
      message: "Twilio configuration error",
      details: {
        missing: [
          !process.env.TWILIO_ACCOUNT_SID && "TWILIO_ACCOUNT_SID",
          !process.env.TWILIO_AUTH_TOKEN && "TWILIO_AUTH_TOKEN",
          !TWILIO_PHONE_NUMBER && "TWILIO_PHONE_NUMBER",
        ].filter(Boolean),
      },
    });
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: cleanedPhone,
    });

    return res.status(200).json({
      success: true,
      message: "SMS sent successfully",
      details: {
        sid: result.sid,
        status: result.status,
      },
    });
  } catch (error) {
    console.error("Twilio send error:", {
      message: error.message,
      code: error.code,
    });

    const knownErrors = {
      21211: ["Invalid phone number", 400],
      21608: ["Phone number not verified", 400],
      21614: ["Invalid phone type", 400],
      20003: ["Invalid Twilio credentials", 401],
    };
    const [messageText, status] = knownErrors[error.code] || [
      "Failed to send SMS",
      500,
    ];

    return res.status(status).json({
      success: false,
      message: messageText,
      details: error.message || "Unknown error occurred",
    });
  }
});

export default router;
