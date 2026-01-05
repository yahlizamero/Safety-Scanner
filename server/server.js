import "dotenv/config";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from "mongoose";

import aiRoutes from "./routes/ai.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Increase limit for base64 images
app.use(express.json({ limit: "10mb" }));

app.use("/images", express.static(path.join(__dirname, "images")));


// CORS – allow all local origins during development
app.use(
  cors({
    origin: true, // reflect request origin
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Always answer preflight (Express 5 safe)
app.options(/.*/, cors());

app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

// Allow running the server even if MongoDB isn't configured yet.
const mongoUri = process.env.MONGO_URI;

const startServer = () =>
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

if (!mongoUri || mongoUri.trim() === "") {
  console.warn("⚠️ MONGO_URI is not set. Starting WITHOUT MongoDB.");
  startServer();
} else {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("✅ Connected to MongoDB Atlas - SafetyScanner");
      return startServer();
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      console.warn("⚠️ Starting server WITHOUT MongoDB.");
      return startServer();
    });
}