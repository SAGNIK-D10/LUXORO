const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST /api/orders
router.post("/", async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            customer_phone,
            address,
            items,
            notes,
        } = req.body;

        if (!customer_name || !customer_email || !address || !items?.length) {
            return res
                .status(400)
                .json({ error: "Name, email, address, and items are required" });
        }

        // Generate order number
        const count = await Order.countDocuments();
        const order_number = `#ORD-${String(count + 1001).padStart(4, "0")}`;

        // Calculate totals
        const orderItems = items.map((item) => ({
            product_id: item.product_id || null,
            product_name: item.product_name || item.name,
            product_img: item.product_img || item.image,
            unit_price: item.unit_price || item.price,
            quantity: item.quantity || 1,
            line_total:
                (item.unit_price || item.price) * (item.quantity || 1),
        }));

        const subtotal = orderItems.reduce((sum, i) => sum + i.line_total, 0);
        const shipping_cost = 0; // Free shipping
        const grand_total = subtotal + shipping_cost;

        const order = await Order.create({
            order_number,
            customer_name,
            customer_email,
            customer_phone: customer_phone || null,
            address,
            subtotal,
            shipping_cost,
            grand_total,
            notes: notes || null,
            items: orderItems,
        });

        res.status(201).json({
            message: "Order placed successfully",
            order: {
                order_number: order.order_number,
                grand_total: order.grand_total,
                status: order.status,
                items: order.items.length,
            },
        });
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
});

// GET /api/orders/:orderNumber
router.get("/:orderNumber", async (req, res) => {
    try {
        const orderNumber = req.params.orderNumber.startsWith("#")
            ? req.params.orderNumber
            : `#${req.params.orderNumber}`;

        const order = await Order.findOne({ order_number: orderNumber }).lean();
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("Order tracking error:", error);
        res.status(500).json({ error: "Failed to fetch order" });
    }
});

module.exports = router;
