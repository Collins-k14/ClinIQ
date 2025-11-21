const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Setup
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const corsOrigins = allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins;

if (process.env.NODE_ENV !== "production") {
  const timestamp = new Date().toISOString();
  process.stdout.write(`[${timestamp}] CORS origins: ${corsOrigins.join(", ")}\n`);
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin) || corsOrigins.includes("*")) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV !== "production") {
        process.stderr.write(`[CORS] Blocked origin: ${origin}\n`);
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-Id"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/symptoms', require('./routes/symptoms'));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/appointments', require('./routes/appointments'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ClinIQ API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// MongoDB Connection
const connectDB = require('./controllers/config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});