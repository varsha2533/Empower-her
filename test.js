import dotenv from "dotenv";
import mongoose from "mongoose";
import SOSAlert from "./server/src/models/SOSAlert.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected ");

    const alert = await SOSAlert.create({
      contacts: [
        {
          name: "Mom",
          phone: "+919999999999",
        },
      ],
      location: {
        lat: 12.97,
        lng: 77.59,
      },
    });

    console.log("Alert saved ");
    console.log(alert);

    process.exit();
  })
  .catch((err) => {
    console.error("Error ", err);
  });