const express = require("express");
const negotiationController = require("../Controllers/negotiationController");
const orderController = require("../Controllers/orderController");

const router = express.Router();
router.patch(
  "/placeBid/:id",
  negotiationController.addBuyerSeller,
  negotiationController.placeBid
);
router.post("/placeBid", negotiationController.placeBid);
router.post("/cancelBid/:id", negotiationController.cancelBid);
router.post("/replyBid/:id", negotiationController.replyBid);
router.post(
  "/acceptBid/:id",
  negotiationController.acceptBid,
  orderController.placeOrder
);
// route.post('/placeBid', negotiationController.CreateBid);
router.get("/", negotiationController.getAllBid);
router.get("/:id", negotiationController.getBid);
router.get("/reply/:token", negotiationController.redirectToReply);

module.exports = router;
