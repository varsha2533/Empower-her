import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectDatabase } from "./src/config/database.js";
import healthRoutes from "./src/routes/health.routes.js";
import smsRoutes from "./src/routes/sms.routes.js";
import sosRoutes from "./src/routes/sos.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRoutes);
app.use("/api", smsRoutes);
app.use("/api/sos", sosRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

connectDatabase()
  .catch((error) => {
    console.warn("MongoDB connection skipped or failed:", error.message);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Express API running on http://localhost:${port}`);
    });
  });
