const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
    {
        sectionId: { type: String, required: true, unique: true },
        sectionName: { type: String, required: true },
        category: { type: String, default: "" },
        subcategory: { type: String, default: "" },
        page: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
