const Buyer = require('../Models/BuyerModel');
const Seller = require('../Models/SellerModel');
const Product = require('../Models/ProductModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const mongoose = require('mongoose');
let User;
const setUser = (res) => {
  User = res.locals.user == 'buyer' ? Buyer : Seller;
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  setUser(res);
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
  });
  // Yes, it's a valid ObjectId, proceed with `findById` call.

  res.status(200).json({
    status: 'success',
    data: {
      User: updatedUser,
    },
  });
  console.log('SS');
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  setUser(res);
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.addProductSeller = catchAsync(async (req, res, next) => {
  setUser(res);
  if (!req.body.seller) req.body.seller = req.user.id;
  const seller = await User.findById(req.user.id);
  console.log(req.body.seller);
  if (seller.productSold)
    await User.findByIdAndUpdate(req.user.id, {
      productSold: seller.productSold + 1,
    });
  else
    await User.findByIdAndUpdate(req.user.id, {
      productSold: 1,
    });

  next();
});
exports.addProduct = factory.createOne(Product);
