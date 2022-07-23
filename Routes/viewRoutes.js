const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");

const router = express.Router();

// router.use(viewsController.alerts);

router.get("/", authController.isLoggedIn, viewsController.getIndex);
router.get("/overview", authController.isLoggedIn, viewsController.getOverview);
router.get("/myCart", authController.isLoggedIn, viewsController.getCart);
router.get("/checkOut", authController.isLoggedIn, viewsController.getCheckOut);
router.get("/myOrders", authController.isLoggedIn, viewsController.getOrders);
router.get(
  "/account/:id",
  authController.isLoggedIn,
  viewsController.getAccount
);

router.get(
  "/product/:id",
  authController.isLoggedIn,
  viewsController.getProduct
);
router.get("/login", viewsController.getLoginForm);
router.get(
  "/search/:key",
  authController.isLoggedIn,
  viewsController.searchProduct
);

module.exports = router;
