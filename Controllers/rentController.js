const catchAsync = require("../utils/catchAsync");
const Rent = require("../Models/rentModel");
const factory = require("./handlerFactory");
const FarmProduct = require("../Models/farmProductModel");
const crypto = require("crypto");
let bid;
exports.startRentDate = catchAsync(async (req, res, next) => {
  const rent = await Rent.findByIdAndUpdate(req.params.id, {
    startDate: Date.now(),
  });
  res.status(201).json({
    status: "success",
    data: rent,
  });
});
exports.endRentDate = catchAsync(async (req, res, next) => {
  const r = await Rent.findById(req.params.id);
  const rent = await Rent.findByIdAndUpdate(req.params.id, {
    endDate: Date.now(),
    totalDays: Math.ceil((Date.now() - r.startDate) / (1000 * 3600 * 24)),
  });
  res.status(201).json({
    status: "success",
    data: rent,
  });
});
exports.addPrice = catchAsync(async (req, res, next) => {
  const product = await FarmProduct.findById(req.body.product);
  req.body.rentAmount = product.rentPrice;

  next();
});
// exports.CreateBid = catchAsync(async (req, res, next) => {});
exports.createRent = factory.createOne(Rent);
exports.getAllRent = factory.getAll(Rent);
exports.getRent = factory.getOne(Rent);
exports.deleteRent = factory.deleteOne(Rent);
