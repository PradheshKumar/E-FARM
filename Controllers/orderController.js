const Buyer = require("../Models/BuyerModel");
const Seller = require("../Models/sellerModel");
const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const mongoose = require("mongoose");

exports.placeOrder = catchAsync(async (req, res, next) => {
  const doc = await Order.create(req.body);
  const buyer = await Buyer.findById(req.body.buyer);
  let products = [];
  // req.body.products.forEach(async (el) => {
  //   products.push(await Product.findById(el));
  // });
  for (let i = 0; i < req.body.products.length; i++) {
    const product = await Product.findById(req.body.products[i]);
    products.push(product);
  }
  // products = await Product.findById(req.body.products[0]);
  //Set OrderId to Seller,Buyer
  const buyerOrders = [...buyer.currentOrders, doc.id];

  await Buyer.findByIdAndUpdate(req.body.buyer, {
    currentOrders: buyerOrders,
    cart: [],
    cartQty: [],
  });

  // // //Reduce Stock of Product
  products.forEach(async (el, i) => {
    let stockLeft = el.stockLeft;
    stockLeft -= req.body.productsQty[i];
    await Product.findByIdAndUpdate(el.id, {
      stockLeft,
    });
    const seller = await Seller.findById(el.seller.id);
    const sellerOrders = [...seller.currentOrders, doc.id];

    await Seller.findByIdAndUpdate(el.seller.id, {
      currentOrders: sellerOrders,
    });
  });

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const doc = await Order.find();
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc,
    },
  });
});
exports.getOrder = factory.getOne(Order);
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const doc = await Order.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }
  const buyer = await Buyer.findById(doc.buyer.id);
  const seller = await Seller.findById(doc.seller.id);

  let buyerOrders = [...buyer.currentOrders];
  let sellerOrders = [...seller.currentOrders];
  buyerOrders = UpdatedOrder(buyerOrders, req.params.id);
  await Buyer.findByIdAndUpdate(buyer, {
    currentOrders: buyerOrders,
  });
  sellerOrders = UpdatedOrder(sellerOrders, req.params.id);
  await Seller.findByIdAndUpdate(seller, {
    currentOrders: sellerOrders,
  });

  res.status(203).json({
    status: "success",
    data: null,
  });
});
const UpdatedOrder = (userOrders, id) => {
  let a = [],
    i;
  userOrders.forEach((e) => {
    a.push(e.toString() == new mongoose.Types.ObjectId(id).toString());
  });
  a.forEach((e, ind) => {
    if (e) i = ind;
  });
  userOrders.splice(i, 1);
  return userOrders;
};
