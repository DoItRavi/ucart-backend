// src/services/productService.js
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Variant = require("../models/variant.model");

// normalize category names to lower for matching
function normalizeName(name) {
  return name.trim().toLowerCase();
}

// Find or create category at given level
async function ensureCategory(name, parentId, level) {
  if (!name) return null;
  const nn = normalizeName(name);
  let cat = await Category.findOne({
    name: nn,
    parentCategory: parentId,
    level,
  });
  if (cat) return cat;
  return Category.create({ name: nn, parentCategory: parentId, level });
}

// Reconstruct category hierarchy names from category ID
async function getCategoryHierarchy(catId) {
  if (!catId)
    return {
      topLevelCategory: null,
      secondLevelCategory: null,
      thirdLevelCategory: null,
    };
  const third = await Category.findById(catId).populate({
    path: "parentCategory",
    populate: { path: "parentCategory" },
  });
  return {
    topLevelCategory: third.parentCategory?.parentCategory?.name || null,
    secondLevelCategory: third.parentCategory?.name || null,
    thirdLevelCategory: third.name,
  };
}

// Convert Variant doc to plain object
function serializeVariant(v) {
  return {
    sku: v.sku,
    attributes: v.attributes,
    price: v.price,
    stock: v.stock,
    images: v.images,
  };
}

// ------------------------------
// CREATE (with merge / upsert)
// ------------------------------
async function createProduct(reqData) {
  const top = await ensureCategory(reqData.topLevelCategory, null, 1);
  const second = await ensureCategory(reqData.secondLevelCategory, top._id, 2);
  const third = await ensureCategory(reqData.thirdLevelCategory, second._id, 3);

  let product = await Product.findOne({
    title: reqData.title,
    category: third._id,
  }).populate("variants");

  if (!product) {
    const variantDocs = await Variant.insertMany(
      reqData.variants.map((v) => ({
        sku: v.sku,
        attributes: v.attributes,
        price: v.price,
        stock: v.stock,
        images: v.images || [],
      }))
    );
    product = await Product.create({
      title: reqData.title,
      description: reqData.description,
      brand: reqData.brand || null,
      images: reqData.images || [],
      tags: reqData.tags || [],
      discount: reqData.discount || 0,
      category: third._id,
      variants: variantDocs.map((v) => v._id),
    });
  } else {
    product.description = reqData.description;
    product.brand = reqData.brand;
    product.discount = reqData.discount;
    product.images = Array.from(
      new Set([...product.images, ...(reqData.images || [])])
    );
    product.tags = Array.from(
      new Set([...product.tags, ...(reqData.tags || [])])
    );

    for (const v of reqData.variants) {
      const existing = product.variants.find((doc) => doc.sku === v.sku);
      if (existing) {
        existing.price = v.price;
        existing.stock = v.stock;
        existing.images = Array.from(
          new Set([...existing.images, ...(v.images || [])])
        );
        await existing.save();
      } else {
        const newVar = await Variant.create({
          sku: v.sku,
          attributes: v.attributes,
          price: v.price,
          stock: v.stock,
          images: v.images || [],
        });
        product.variants.push(newVar._id);
      }
    }
    await product.save();
  }

  return await findProductById(product._id);
}

// ------------------------------
// FIND single product by ID
// ------------------------------
async function findProductById(productId) {
  const product = await Product.findById(productId)
    .populate("variants")
    .populate("category");
  if (!product)
    throw Object.assign(new Error("Product not found"), { status: 404 });

  const cats = await getCategoryHierarchy(product.category?._id);
  return {
    _id: product._id,
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    brand: product.brand,
    topLevelCategory: cats.topLevelCategory,
    secondLevelCategory: cats.secondLevelCategory,
    thirdLevelCategory: cats.thirdLevelCategory,
    tags: product.tags,
    images: product.images,
    discount: product.discount,
    variants: product.variants.map(serializeVariant),
  };
}

// ------------------------------
// GET ALL products (public)
// ------------------------------
async function getAllProducts() {
  const products = await Product.find()
    .populate("variants")
    .populate("category");
  return await Promise.all(
    products.map(async (p) => {
      const cats = await getCategoryHierarchy(p.category?._id);
      return {
        _id: p._id,
        id: p._id.toString(),
        title: p.title,
        description: p.description,
        brand: p.brand,
        topLevelCategory: cats.topLevelCategory,
        secondLevelCategory: cats.secondLevelCategory,
        thirdLevelCategory: cats.thirdLevelCategory,
        tags: p.tags,
        images: p.images,
        discount: p.discount,
        variants: p.variants.map(serializeVariant),
      };
    })
  );
}

// ------------------------------
// UPDATE product (basic fields + variants)
// ------------------------------
async function updateProduct(productId, updateData) {
  const product = await Product.findById(productId).populate("variants");
  if (!product)
    throw Object.assign(new Error("Product not found"), { status: 404 });

  ["title", "description", "brand", "discount", "images", "tags"].forEach(
    (field) => {
      if (updateData[field] !== undefined) product[field] = updateData[field];
    }
  );

  if (Array.isArray(updateData.variants)) {
    for (const v of updateData.variants) {
      const existing = product.variants.find((d) => d.sku === v.sku);
      if (existing) {
        existing.price = v.price ?? existing.price;
        existing.stock = v.stock ?? existing.stock;
        existing.images = Array.from(
          new Set([...existing.images, ...(v.images || [])])
        );
        await existing.save();
      } else {
        const newVar = await Variant.create({
          sku: v.sku,
          attributes: v.attributes,
          price: v.price,
          stock: v.stock,
          images: v.images || [],
        });
        product.variants.push(newVar._id);
      }
    }
  }
  await product.save();
  return await findProductById(productId);
}

// ------------------------------
// DELETE product
// ------------------------------
async function deleteProduct(productId) {
  const product = await Product.findById(productId);
  if (!product)
    throw Object.assign(new Error("Product not found"), { status: 404 });
  await Variant.deleteMany({ _id: { $in: product.variants } });
  await Product.findByIdAndDelete(productId);
}

module.exports = {
  createProduct,
  findProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
