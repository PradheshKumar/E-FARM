const catchAsync = require("./../utils/catchAsync");
const Negotiation = require("./../Models/negotiationModel");
const factory = require("./handlerFactory");
const Product = require("./../Models/productModel");
const AppError = require("./../utils/appError");
const Seller = require("./../Models/sellerModel");
const Buyer = require("./../Models/buyerModel");
const Email = require("../utils/email");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
let bid;
exports.placeBid1 = catchAsync(async (req, res, next) => {
  try {
    let startingPrice;
    if (req.params.id) {
      bid = await Negotiation.findByIdAndUpdate(req.params.id, req.body);

      sendNegoMail(req, res, "old");
    } else {
      const sellerId = (await Product.findById(req.body.product)).seller.id;
      req.body.seller = sellerId;
      bid = await Negotiation.create(req.body);
      const seller = await Seller.findByIdAndUpdate(req.body.seller, {
        negotiations: bid.id,
      });
      const buyer = await Buyer.findByIdAndUpdate(req.body.buyer, {
        negotiations: bid.id,
      });

      // console.log(req.body.buyer);
      res.status(201).json({
        status: "success",
        data: {
          data: bid,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
  // startingPrice = (await Product.findById(req.body.product)).price;
  // bid = await Negotiation.findByIdAndUpdate(bid.id, {
  //   startingPrice,
  // });
  // sendNegoMail(req, res, 'new');
});
exports.placeBid = catchAsync(async (req, res, next) => {
  try {
    let startingPrice;
    if (req.params.id) {
      bid = await Negotiation.findByIdAndUpdate(req.params.id, req.body);

      sendNegoMail(req, res, "old");
    } else {
      const sellerId = (await Product.findById(req.body.product)).seller.id;
      const seller = await Seller.findById(sellerId);
      const buyer = await Buyer.findById(req.body.buyer);
      req.body.seller = sellerId;
      bid = await Negotiation.create(req.body);

      await Seller.findByIdAndUpdate(req.body.seller, {
        negotiations: [...seller.negotiations, bid.id],
      });
      await Buyer.findByIdAndUpdate(req.body.buyer, {
        negotiations: [...buyer.negotiations, bid.id],
      });

      // console.log(req.body.buyer);
      res.status(201).json({
        status: "success",
        data: {
          data: bid,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
  // startingPrice = (await Product.findById(req.body.product)).price;
  // bid = await Negotiation.findByIdAndUpdate(bid.id, {
  //   startingPrice,
  // });
  // sendNegoMail(req, res, 'new');
});
exports.acceptBid = catchAsync(async (req, res, next) => {
  const nego = await Negotiation.findById(req.params.id);
  const sellerId = (await Product.findById(nego.product)).seller.id;
  const seller = await Seller.findById(sellerId);
  const buyer = await Buyer.findById(nego.buyer);
  req.body = {
    products: [nego.product],
    buyer: nego.buyer,
    totalPrice: nego.currentBid,
    productsQty: [nego.qty],
    estimateDelivery: Date.now() + 300000000,
  };
  console.log("Dsdsd", req.body.productsQty);
  req.body.products.length = 1;
  await Negotiation.findByIdAndDelete(req.params.id);
  // const buyerNego = buyer.negotiations;
  let index;
  //////////////////////////////////////////////////////////////////
  for (let i = 0; i < buyer.negotiations.length - 1; i++) {
    if (buyer.negotiations[i] == req.params.id) index = i;
  }
  for (let i = index; i < buyer.negotiations.length - 1; i++) {
    buyer.negotiations[i] = buyer.negotiations[i + 1];
  }
  buyer.negotiations.pop(-1);
  ///////////////////////////////////////////////////////////////////////
  for (let i = 0; i < seller.negotiations.length - 1; i++) {
    if (seller.negotiations[i] == req.params.id) index = i;
  }
  for (let i = index; i < seller.negotiations.length - 1; i++) {
    seller.negotiations[i] = seller.negotiations[i + 1];
  }
  seller.negotiations.pop(-1);
  /////////////////////////////////////////////////////////////////////
  await Buyer.findByIdAndUpdate(nego.buyer, {
    negotiations: buyer.negotiations,
  });
  await Seller.findByIdAndUpdate(sellerId, {
    negotiations: seller.negotiations,
  });

  next();
});
exports.cancelBid = catchAsync(async (req, res, next) => {
  const nego = await Negotiation.findById(req.params.id);
  const sellerId = (await Product.findById(nego.product)).seller.id;
  const seller = await Seller.findById(sellerId);
  const buyer = await Buyer.findById(nego.buyer);
  await Negotiation.findByIdAndDelete(req.params.id);
  // const buyerNego = buyer.negotiations;
  let index;
  //////////////////////////////////////////////////////////////////
  for (let i = 0; i < buyer.negotiations.length - 1; i++) {
    if (buyer.negotiations[i] == req.params.id) index = i;
  }
  for (let i = index; i < buyer.negotiations.length - 1; i++) {
    buyer.negotiations[i] = buyer.negotiations[i + 1];
  }
  buyer.negotiations.pop(-1);
  ///////////////////////////////////////////////////////////////////////
  for (let i = 0; i < seller.negotiations.length - 1; i++) {
    if (seller.negotiations[i] == req.params.id) index = i;
  }
  for (let i = index; i < seller.negotiations.length - 1; i++) {
    seller.negotiations[i] = seller.negotiations[i + 1];
  }
  seller.negotiations.pop(-1);
  /////////////////////////////////////////////////////////////////////
  await Buyer.findByIdAndUpdate(nego.buyer, {
    negotiations: buyer.negotiations,
  });
  await Seller.findByIdAndUpdate(sellerId, {
    negotiations: seller.negotiations,
  });
  res.status(201).json({
    status: "success",
    data: {},
  });
});
exports.replyBid = catchAsync(async (req, res, next) => {
  try {
    const nego = await Negotiation.findByIdAndUpdate(req.params.id, {
      $inc: { negoStage: 1 },
      currentBid: req.body.replyPrice,
    });
  } catch (e) {
    console.log(e);
  }
  res.status(201).json({
    status: "success",
    data: {},
  });
});
exports.addBuyerSeller = catchAsync(async (req, res, next) => {
  const bid = await Negotiation.findById(req.params.id);
  if (!bid) {
    return next(new AppError("No Negotiation found with that ID", 404));
  }
  // console.log(bid);
  req.body.seller = bid.seller;
  req.body.buyer = bid.buyer;
  next();
});
const sendNegoMail = catchAsync(async (req, res, type) => {
  // 1) Get user based on POSTed email
  const seller = await Seller.findById(req.body.seller);
  const buyer = await Buyer.findById(req.body.buyer);
  const nego = await Negotiation.findById(bid.id);
  // if (!seller) {

  //   return next(new AppError('There is no Seller with the Id.', 404));
  // }
  // 2) Generate the random reset token
  let resetToken;

  if (type == "new") {
    resetToken = nego.createNegoToken();
    await nego.save({ validateBeforeSave: false });
  } else {
    resetToken = bid.negoToken;
  }

  // 3) Send it to user's email

  try {
    if (type == "new") {
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/negotiation/reply/${resetToken}`;
      await new Email(seller, resetURL).sendNewNego();
    } else {
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/negotiation/reply/${resetToken}`;
      if (bid.lastBidBy == "seller")
        await new Email(buyer, resetURL).sendOldNego(bid.lastBid);
      else await new Email(seller, resetURL).sendOldNego(bid.lastBid);
    }
    res.status(201).json({
      status: "success",
      data: {
        data: bid,
      },
    });
  } catch (err) {
    console.log(err);
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
exports.redirectToReply = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  // console.log(req.params.token + '  sss');
  const hashedToken = req.params.token;
  // const hashedToken = crypto
  //   .createHash('sha256')
  //   .update(req.params.token)
  //   .digest('hex');
  // console.log(hashedToken + '  sss');
  const nego = await Negotiation.findOne({
    negoToken: hashedToken,
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!nego) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  res.status(201).json({
    "Place NEw Nego": "or accept", ///////////////////////////////Replace  LInk To reply
  });
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
});
// exports.CreateBid = catchAsync(async (req, res, next) => {});
exports.getAllBid = factory.getAll(Negotiation);
exports.getBid = factory.getOne(Negotiation);
exports.deleteBid = factory.deleteOne(Negotiation);
