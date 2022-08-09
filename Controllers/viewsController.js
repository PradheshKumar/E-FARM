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
exports.withinRange = catchAsync(async (req, res, next) => {
  //productsWithin/170/center/13.075698238965733, 80.27799744232169
  // const { distance, latlng, unit } = req.params;
  const [lat, lng, distance] = req.params.latlngDist.split(",");
  const radius = distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400
      )
    );
  }
  let products = await Product.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const productsQueried = await features.query;
  let k = 1;
  let flag = [],
    flag1 = [];
  ///////COPYING FILTERING
  products.forEach((el, i) => {
    productsQueried.forEach((el2) => {
      if (el.id != el2.id) {
        // console.log(i, el.name);
        if (!flag.includes(i) && !flag1.includes(i)) {
          flag.push(i);
        }
        // console.log(el.id != el2.id, el.name, el2.name, i);
      } else {
        flag1.push(i);
        if (flag.includes(i)) flag.pop(flag.indexOf(i));
      }
    });
  });
  k = 0;
  flag.forEach((i) => {
    products.splice(i - k, 1);
    k++;
  });
  ///////////COPYING SORT
  flag = [];
  products.forEach((el) => {
    productsQueried.forEach((el2, i) => {
      if (el.id == el2.id) {
        flag[i] = el;
      }
    });
  });
  flag = flag.filter((element) => {
    return element !== null && element !== undefined;
  });
  console.log(flag.length);
  products = flag;
  // console.log(flag);
  // console.log(products);
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
    title: product.name,
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
