const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");

const router = express.Router();
const setUser = (req, res, next) => {
  res.locals.user = "seller";
  next();
};
// router.use(viewsController.alerts);

router.get("/", authController.isLoggedIn, viewsController.getIndex);
router.get("/overview", authController.isLoggedIn, viewsController.getOverview);
router.get("/myCart", authController.isLoggedIn, viewsController.getCart);
router.get("/checkOut", authController.isLoggedIn, viewsController.getCheckOut);
router.get("/myOrders", authController.isLoggedIn, viewsController.getOrders);
router.get(
  "/negotiate",
  authController.isLoggedIn,
  viewsController.getNegotiations
);
router.get("/account", authController.isLoggedIn, viewsController.getAccount);

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
/////////////////////SELLER ROUTES
router.get("/seller-login", viewsController.getLoginForm);
router.get(
  "/seller_products",
  setUser,
  authController.isLoggedIn,
  viewsController.sellerProducts
);
router.get(
  "/seller_negotiate",
  authController.isLoggedIn,
  viewsController.sellergetNegotiations
);

module.exports = router;
