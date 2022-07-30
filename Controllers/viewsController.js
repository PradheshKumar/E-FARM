const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");
const Buyer = require("../Models/buyerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
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
exports.getAbout = catchAsync(async (req, res, next) => {
  res.status(200).render("aboutus", {
    title: "ABOUT US",
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
exports.getCheckOut = catchAsync(async (req, res, next) => {
  // 1) Get product data from collections

  // const doc = await features.query.explain();
  const User = await Buyer.findById(req.params.id); // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render("checkout", {
    title: "CheckOut",
    User,
  });
});
exports.getOrders = catchAsync(async (req, res, next) => {
  // 1) Get product data from collections

  // const doc = await features.query.explain();
  const User = await Buyer.findById(res.locals.user).populate({
    path: "currentOrders",
    populate: { path: "products" },
  });
  res.status(200).render("myorder", {
    title: "My Orders",
    User,
  });
});
exports.getNegotiations = catchAsync(async (req, res, next) => {
  // 1) Get product data from collections

  // const doc = await features.query.explain();
  // const User = await Buyer.findById(req.body.user).populate({
  //   path: "negotiations",
  //   fields: "",
  // }); // 2) Build template
  // // 3) Render that template using product data from 1)
  // console.log(req.body.user);
  res.status(200).render("negotiate", {
    title: "My Negotiations",
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
exports.getOrderPlaced = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("products");
  const products = await Product.find();
  res.status(200).render("order_placed", {
    title: "Order placed successfully",
    products,
    order,
  });
});
exports.viewOrder = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  const order = await Order.findById(req.params.id).populate("products");
  res.status(200).render("order_view", {
    title: "Your Order",
    products,
    order,
  });
});
exports.getLoginForm = (req, res) => {
  // console.log(req.query);
  res.status(200).render("login", {
    title: "Log into your account",
  });
};
exports.getForgotPassword = (req, res) => {
  res.status(200).render("forgotPassword", {
    title: "Change Your Password",
    token: req.params.token,
  });
};
exports.getEditAccount = (req, res) => {
  res.status(200).render("editAccount", {
    title: "Edit Your Details",
  });
};
/////////////////////////////////SELLER
exports.sellerProducts = catchAsync(async (req, res, next) => {
  res.status(200).render("seller_products", {
    title: "Your Products",
  });
});
exports.sellerAddProduct = catchAsync(async (req, res, next) => {
  res.status(200).render("seller_addProduct", {
    title: "Add New Product",
  });
});
exports.sellergetNegotiations = catchAsync(async (req, res, next) => {
  res.status(200).render("seller_negotiate", {
    title: "My Negotiations",
  });
});
