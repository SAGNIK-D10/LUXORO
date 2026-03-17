require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("./models/Product");
const Section = require("./models/Section");

async function seed() {
    try {
        console.log("🔗 Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB Atlas");

        // Read products.json
        const jsonPath = path.join(__dirname, "..", "products.json");
        const rawData = fs.readFileSync(jsonPath, "utf-8");
        const data = JSON.parse(rawData);

        // Clear existing data
        console.log("🗑️  Clearing existing products and sections...");
        await Product.deleteMany({});
        await Section.deleteMany({});

        // Seed sections
        console.log("📦 Seeding sections...");
        const sectionDocs = data.sections.map((section) => ({
            sectionId: section.sectionId,
            sectionName: section.sectionName,
            category: section.category || "",
            subcategory: section.subcategory || "",
            page: section.page || "",
        }));
        await Section.insertMany(sectionDocs);
        console.log(`   ✅ ${sectionDocs.length} sections created`);

        // Seed products
        console.log("📦 Seeding products...");
        const productDocs = [];
        data.sections.forEach((section) => {
            (section.products || []).forEach((product) => {
                productDocs.push({
                    id: product.id,
                    sectionId: section.sectionId,
                    name: product.name,
                    description: product.description || "",
                    image: product.image || "",
                    price: product.price,
                    salePrice: product.salePrice ?? null,
                    stock: product.stock || 0,
                    movement: product.movement || "quartz",
                });
            });
        });
        await Product.insertMany(productDocs);
        console.log(`   ✅ ${productDocs.length} products created`);

        console.log("\n🎉 Database seeded successfully!");
        console.log(`   Database: commerza`);
        console.log(`   Sections: ${sectionDocs.length}`);
        console.log(`   Products: ${productDocs.length}`);
    } catch (error) {
        console.error("❌ Seed failed:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
}

seed();
