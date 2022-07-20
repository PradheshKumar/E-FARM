const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const negotiationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Negotiations must have a Product'],
  },
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Buyer',
    required: [true, 'Negotiations must have a Buyer'],
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'Seller',
    required: [true, 'Negotiations must have a Seller'],
  },
  startingPrice: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  lastBidBy: {
    type: String,
    enum: ['buyer', 'seller'],
    required: [true, 'Enter Last Bidder Role'],
  },
  lastBid: { type: Number, required: [true, 'Enter Last Bid'] },
  negoToken: String,
});
negotiationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'buyer',
    select: 'name _id',
  });
  this.populate({
    path: 'seller',
    select: 'name _id',
  });
  this.populate({
    path: 'product',
    select: 'name _id',
  });
  next();
});
negotiationSchema.methods.createNegoToken = function () {
  const resetToken = crypto.randomBytes(16).toString('hex');

  this.negoToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  // this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports =
  mongoose.models.Negotiation ||
  mongoose.model('Negotiation', negotiationSchema);
