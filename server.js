require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from root (index.html, cart.html, etc.)
app.use(express.static(path.join(__dirname)));

// API Routes
app.use("/api/products", require("./backend/routes/products"));
app.use("/api/users", require("./backend/routes/users"));
app.use("/api/orders", require("./backend/routes/orders"));
app.use("/api/contact", require("./backend/routes/contact"));

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
    });

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
