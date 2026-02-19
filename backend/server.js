
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute=require('./routes/authRoutes')
const employeRoute=require('./routes/employeRoutes');
const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/employee", employeRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;


/*
//new
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require('./routes/authRoutes');
const employeRoute = require('./routes/employeRoutes');
const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoute);
app.use("/employee", employeRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint (good for testing)
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ✅ IMPORTANT: Only listen() when NOT on Vercel
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export for Vercel Serverless Functions
module.exports = app;

*/