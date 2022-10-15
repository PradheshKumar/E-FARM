const mongoose = require("mongoose");
const orderController = require("../Controllers/orderController");

const rentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "FarmProduct",
    required: [true, "Rent must have a Product"],
  },
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: "Seller",
    required: [true, "Rent must have a Buyer"],
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "FarmSeller",
    required: [true, "Rent must have a Seller"],
  },
  rentAmount: {
    type: Number,
  },
  startDate: {
    type: Date,
  },
  totalDays: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  endDate: {
    type: Date,
  },
});

rentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "buyer",
    select: "name _id email",
  });
  this.populate({
    path: "seller",
    select: "name _id email",
  });
  this.populate({
    path: "product",
    select: "name _id images price rentPrice  ",
  });
  next();
});
// rentSchema.pre('save', () => {
//   RentController.postRent();
// });

module.exports = mongoose.models.Rent || mongoose.model("Rent", rentSchema);
