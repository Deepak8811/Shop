import Product from "../models/productModel.js";
import asynchandler from "express-async-handler";

// @desc FETCH ALL PRODUCTS
// @router /api/products?keyword=
// @access public
export const getProducts = asynchandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc FETCH single product
// @router /api/products/:id
// @access public
export const getProductById = asynchandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc DELETE Product by id
// @router DELETE /api/products/:id
// @access Private/Admin
export const deleteProductById = asynchandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.status(201).json({
      message: `Product Deleted by admin of id #${req.user._id} `,
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc create new product
// @router DELETE /api/products
// @access Private/Admin
export const createProduct = asynchandler(async (req, res) => {
  const product = new Product({
    name: "sample",
    price: "69.69",
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample",
    category: "test",
    countInStock: 2,
    numReviews: 5,
    description: "This is sample",
  });
  const savedProduct = await product.save();
  res.status(201).json(savedProduct);
});

// @desc update product
// @router PUT /api/products/:id
// @access Private/Admin
export const updateProduct = asynchandler(async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;
  const product = await Product.findById(req.params.id).exec();
  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.description = description;
    const updatedProduct = await product.save();
    res.json(updateProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create new review
// @router POST /api/products/:id/review
// @access Private
export const createProductReview = asynchandler(async (req, res) => {
  const { comment, rating } = req.body;
  const product = await Product.findById(req.params.id).exec();
  if (product) {
    const alreadyReviewd = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewd) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({
      message: "Review added",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc get top products
// @router GET /api/products/top
// @access public
export const getTopProducts = asynchandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});
