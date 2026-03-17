const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        sectionId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
        price: { type: Number, required: true },
        salePrice: { type: Number, default: null },
        stock: { type: Number, default: 0 },
        movement: {
            type: String,
            enum: ["auto", "manual", "quartz", "smart"],
            default: "quartz",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
