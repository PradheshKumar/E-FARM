const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const negotiationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "Negotiations must have a Product"],
  },
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: "Buyer",
    required: [true, "Negotiations must have a Buyer"],
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "Seller",
  },
  startingPrice: Number,
  negoStage: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  lastBidBy: {
    type: String,
    enum: ["buyer", "seller"],
  },
  qty: Number,
  currentBid: Number,
  negoToken: String,
});
negotiationSchema.pre(/^find/, function (next) {
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
    select: "name  -seller images img costPer",
  });
  next();
});
negotiationSchema.methods.createNegoToken = function () {
  const resetToken = crypto.randomBytes(16).toString("hex");

  this.negoToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  // this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports =
  mongoose.models.Negotiation ||
  mongoose.model("Negotiation", negotiationSchema);
