const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product_id: { type: Number, default: null },
    product_name: { type: String, required: true },
    product_img: { type: String, default: null },
    unit_price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    line_total: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
    {
        order_number: { type: String, required: true, unique: true },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        customer_name: { type: String, required: true },
        customer_email: { type: String, required: true },
        customer_phone: { type: String, default: null },
        address: { type: String, required: true },
        subtotal: { type: Number, required: true },
        shipping_cost: { type: Number, default: 0 },
        grand_total: { type: Number, required: true },
        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
                "Refunded",
            ],
            default: "Pending",
        },
        payment_status: {
            type: String,
            enum: ["unpaid", "paid", "partially_refunded", "refunded"],
            default: "unpaid",
        },
        payment_method: { type: String, default: "Cash on Delivery (COD)" },
        notes: { type: String, default: null },
        items: [orderItemSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
