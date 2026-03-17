const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

// POST /api/contact
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res
                .status(400)
                .json({ error: "Name, email, and message are required" });
        }

        const contact = await ContactMessage.create({
            name,
            email,
            message,
            ip_address: req.ip || null,
        });

        res.status(201).json({
            message: "Message sent successfully",
            id: contact._id,
        });
    } catch (error) {
        console.error("Contact error:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
});

module.exports = router;
