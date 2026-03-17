const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// POST /api/users/signup
router.post("/signup", async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;

        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { phone }],
        });
        if (existingUser) {
            return res
                .status(409)
                .json({ error: "Email or phone already registered" });
        }

        const salt = await bcrypt.genSalt(12);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            full_name,
            email: email.toLowerCase(),
            phone,
            password_hash,
        });

        res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Signup failed" });
    }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                profile_picture: user.profile_picture,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
