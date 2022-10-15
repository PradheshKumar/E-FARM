const mongoose = require("mongoose");
const orderController = require("../Controllers/orderController");

const farmOrderSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "FarmProduct",
      required: [true, "Order must have a Product"],
    },
  ],
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: "Seller",
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

farmOrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "buyer",
    select: "name _id email",
  });
  this.populate({
    path: "products",
    select: "name _id images price",
  });
  next();
});
// orderSchema.pre('save', () => {
//   orderController.postOrder();
// });

module.exports =
  mongoose.models.FarmOrder || mongoose.model("FarmOrder", farmOrderSchema);
