const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getIndex = catchAsync(async (req, res, next) => {
  // 1) Get product data from collection
  const products = await Product.find();

  // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render('index', {
    title: 'E-FARM',
    products,
  });
});
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get product data from collection
  const products = await Product.find();

  // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render('overview', {
    title: 'E-FARM',
    products,
  });
});
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'seller',
    fields: 'name email photo',
  });
  if (!product)
    return next(new AppError('There is no product with that id', 404));
  res.status(200).render('product', {
    title: `${product.name} product`,
    product,
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
