const Buyer = require("../Models/buyerModel");
const Seller = require("../Models/sellerModel");
const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
    if (stockLeft < 0) stockLeft = 0;
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

  let products = [];
  for (let i = 0; i < doc.products.length; i++) {
    const product = await Product.findById(doc.products[i]);
    products.push(product);
  }
  let buyerOrders = [...buyer.currentOrders];

  buyerOrders = UpdatedOrder(buyerOrders, req.params.id);
  await Buyer.findByIdAndUpdate(buyer, {
    currentOrders: buyerOrders,
  });

  products.forEach(async (el, i) => {
    let stockLeft = el.stockLeft;
    stockLeft += doc.productsQty[i];
    await Product.findByIdAndUpdate(el.id, {
      stockLeft,
    });
    const seller = await Seller.findById(el.seller.id);
    let sellerOrders = [...seller.currentOrders];
    sellerOrders = UpdatedOrder(sellerOrders, req.params.id);
    await Seller.findByIdAndUpdate(seller, {
      currentOrders: sellerOrders,
    });
  });
  res.status(304).redirect("/");
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
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const order = await Order.findById(req.params.orderId);
  const prod = await Product.findById(order.products[0]);
  // console.log(tour);
  console.log(prod);
  let session;
  // 2) Create checkout session
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      success_url: `${req.protocol}://${req.get("host")}/order_placed/${
        req.params.orderId
      }`,
      cancel_url: `${req.protocol}://${req.get(
        "host"
      )}/api/v1/order/order_cancel/${req.params.orderId}`,
      customer_email: order.buyer.email,
      client_reference_id: req.params.orderId,
      line_items: [
        {
          name: `Order Id :${order.buyer.id}`,
          images: [
            `https://e-farm-web.herokuapp.com/img/${prod.images[0]}`,
            `https://e-farm-web.herokuapp.com/img/${prod.images[1]}`,
          ],
          amount: order.totalPrice * 100,
          currency: "inr",
          quantity: order.productsQty.length,
        },
      ],
    });
  } catch (e) {
    console.log(e);
  }
  // console.log(session.url);
  // res.redirect(303, session.url);

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    data: session.url,
  });
});
