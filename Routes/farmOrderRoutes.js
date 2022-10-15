const express = require("express");
const orderController = require("../Controllers/farmOrderController");
const authController = require("../Controllers/authController");

const router = express.Router();

router.post("/newOrder", orderController.placeOrder);
router.get("/", orderController.getAllOrders);
router.get(
  "/checkOutPage/:orderId",
  authController.isLoggedIn,
  orderController.getCheckoutSession
);
router.get(
  "/order_cancel/:id",
  authController.isLoggedIn,
  orderController.deleteOrder
);
router
  .route("/:id")
  .get(orderController.getOrder)
  .delete(orderController.deleteOrder);
module.exports = router;
