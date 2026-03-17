const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        full_name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: { type: String, required: true, unique: true },
        password_hash: { type: String, required: true },
        address: { type: String, default: null },
        profile_picture: { type: String, default: null },
        reset_token: { type: String, default: null },
        reset_token_expiry: { type: Date, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
