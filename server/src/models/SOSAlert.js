import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema(
  {
    contacts: [
      {
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
    ],

    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    message: {
      type: String,
      default: "Emergency SOS Alert",
    },

    smsStatus: {
      type: String,
      enum: ["pending", "sent", "failed", "simulated"],
      default: "pending",
    },

    riskScore: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SOSAlert", sosAlertSchema);