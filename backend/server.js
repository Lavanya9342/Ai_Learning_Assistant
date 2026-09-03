import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

// --------------------------------------------------
// Load Environment Variables
// --------------------------------------------------

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

// --------------------------------------------------
// DNS Configuration
// --------------------------------------------------

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// --------------------------------------------------
// ES6 __dirname Configuration
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// Initialize Express
// --------------------------------------------------

const app = express();

// --------------------------------------------------
// Connect MongoDB
// --------------------------------------------------

connectDB();

// --------------------------------------------------
// CORS Middleware
// --------------------------------------------------

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --------------------------------------------------
// Body Parser Middleware
// --------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Static Folder for Uploads
// --------------------------------------------------

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// --------------------------------------------------
// ROOT ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Learning Assistant API is running",
  });
});

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use("/api/auth", authRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/flashcards", flashcardRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/progress", progressRoutes);

// --------------------------------------------------
// Error Handler
// --------------------------------------------------

app.use(errorHandler);

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    statusCode: 404,
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});

// --------------------------------------------------
// Handle Unhandled Promise Rejection
// --------------------------------------------------

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);

  process.exit(1);
});