const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Section = require("../models/Section");

// GET /api/products
// Returns the same shape as products.json: { meta, sections: [...] }
router.get("/", async (req, res) => {
    try {
        const sections = await Section.find().lean();
        const products = await Product.find().lean();

        const sectionsData = sections.map((section) => {
            const sectionProducts = products
                .filter((p) => p.sectionId === section.sectionId)
                .map((p) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    image: p.image,
                    price: p.price,
                    salePrice: p.salePrice,
                    stock: p.stock,
                    movement: p.movement,
                }));

            return {
                sectionId: section.sectionId,
                sectionName: section.sectionName,
                category: section.category,
                subcategory: section.subcategory,
                page: section.page,
                products: sectionProducts,
            };
        });

        res.json({
            meta: {
                total: products.length,
                currency: "INR",
                lastUpdated: new Date().toISOString().split("T")[0],
            },
            sections: sectionsData,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findOne({
            id: parseInt(req.params.id),
        }).lean();
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const section = await Section.findOne({
            sectionId: product.sectionId,
        }).lean();

        res.json({
            ...product,
            sectionName: section?.sectionName || "",
            sectionId: product.sectionId,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

module.exports = router;
