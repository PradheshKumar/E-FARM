const mongoose = require("mongoose");
const orderController = require("./../Controllers/orderController");

const orderSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Order must have a Product"],
    },
  ],
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: "Buyer",
    required: [true, "Order must have a Buyer"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Order must have a price."],
  },
  productsQty: [
    {
      type: Number,
      required: [true, "Order must have quantity"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  estimateDelivery: {
    type: Date,
    default: Date.now() + 200000000, //2days
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "buyer",
    select: "name _id",
  });
  this.populate({
    path: "seller",
    select: "name _id",
  });
  this.populate({
    path: "product",
    select: "name _id",
  });
  next();
});
// orderSchema.pre('save', () => {
//   orderController.postOrder();
// });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
