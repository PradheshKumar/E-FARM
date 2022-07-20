const Seller = require('../Models/sellerModel');
const Product = require('../Models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getProduct = factory.getOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.searchProduct = catchAsync(async (req, res, next) => {
  const data = await Product.find({
    name: { $regex: new RegExp(req.params.key, 'i') },
  });
  res.status(200).json({
    status: 'success',
    results: data.length,
    data,
  });
});
// Do NOT update passwords with this!
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
