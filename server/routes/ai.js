
// server/routes/ai.js
import express from "express";
import { safetyCheck } from "../controllers/aiController.js";

const router = express.Router();

router.post("/safety-check", safetyCheck);

export default router;