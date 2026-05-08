import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Express API is running",
    service: "empower-her-api",
    timestamp: new Date().toISOString(),
  });
});

router.get("/health-check", (_req, res) => {
  res.json({
    success: true,
    message: "Network and API are available",
  });
});

export default router;
