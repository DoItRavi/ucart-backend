const mongoose = require("mongoose");
const Category = require("../src/models/category.model");
require("dotenv").config(); // if using .env for DB URI

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/ucart"
    );

    console.log("Connected to MongoDB ✅");

    // Clear existing categories if needed
    await Category.deleteMany({});
    console.log("Cleared old categories");

    // --- Top-Level ---
    const men = await Category.create({ name: "Men", level: 1 });
    const women = await Category.create({ name: "Women", level: 1 });

    // --- Level 2 (Sub-categories) ---
    const menClothing = await Category.create({
      name: "Clothing",
      level: 2,
      parentCategory: men._id,
    });
    const menAccessories = await Category.create({
      name: "Accessories",
      level: 2,
      parentCategory: men._id,
    });

    const womenClothing = await Category.create({
      name: "Clothing",
      level: 2,
      parentCategory: women._id,
    });
    const womenAccessories = await Category.create({
      name: "Accessories",
      level: 2,
      parentCategory: women._id,
    });

    // --- Level 3 (Actual categories) ---
    const level3 = [
      // Men → Clothing
      { name: "Pajama", parentCategory: menClothing._id },
      { name: "Kurta", parentCategory: menClothing._id },
      { name: "Shirts", parentCategory: menClothing._id },
      { name: "Pants", parentCategory: menClothing._id },

      // Men → Accessories
      { name: "Watches", parentCategory: menAccessories._id },
      { name: "Shoes", parentCategory: menAccessories._id },

      // Women → Clothing
      { name: "Sarees", parentCategory: womenClothing._id },
      { name: "Lehenga", parentCategory: womenClothing._id },
      { name: "Salwar Kameez", parentCategory: womenClothing._id },

      // Women → Accessories
      { name: "Watches", parentCategory: womenAccessories._id },
    ];

    // Insert all level 3
    for (const cat of level3) {
      await Category.create({
        name: cat.name,
        level: 3,
        parentCategory: cat.parentCategory,
      });
    }

    console.log("🎉 All categories seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
    process.exit(1);
  }
}

seedCategories();
