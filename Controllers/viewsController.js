const Product = require("../models/productModel");
const Buyer = require("../models/buyerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const ObjectId = require("mongodb").ObjectID;
exports.getIndex = catchAsync(async (req, res, next) => {
  // 1) Get product data from collection
  const products = await Product.find();

  // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render("index", {
    title: "E-FARM",
    products,
  });
});
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get product data from collections
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const products = await features.query;
  // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render("overview", {
    title: "E-FARM",
    products,
  });
});
exports.getAccount = catchAsync(async (req, res, next) => {
  // 1) Get product data from collections

  // const doc = await features.query.explain();
  const User = await Buyer.findById(req.params.id); // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render("account", {
    title: "My Account",
    User,
  });
});
exports.getCart = catchAsync(async (req, res, next) => {
  // 1) Get product data from collections

  // const doc = await features.query.explain();
  const User = await Buyer.findById(req.params.id); // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render("cart", {
    title: "My Cart",
    User,
  });
});
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: "seller",
    fields: "name email photo",
  });
  let products = await Product.find({
    _id: { $ne: req.params.id },
  });
  products = [product, products];
  if (!product)
    return next(new AppError("There is no product with that id", 404));
  res.status(200).render("product", {
    title: `${product.name} product`,
    products,
  });
});
exports.searchProduct = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    name: { $regex: new RegExp(req.params.key, "i") },
  });

  res.status(200).render("overview", {
    title: "E-FARM",
    products,
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};
