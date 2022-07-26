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
function allowBuyer(req, res, next) {
  if (res.locals.user.role == "seller") {
    res.status(401).redirect("/seller_products");
    // .json({
    //   status: "Permission denied",
    //   message: "Your Are Not allowed to use this route . Redirecting....",
    // });
  } else next();
}
router.get(
  "/",
  authController.isLoggedIn,

  viewsController.getIndex
);
router.get("/aboutUs", authController.isLoggedIn, viewsController.getAbout);
router.get(
  "/overview",
  authController.isLoggedIn,
  allowBuyer,
  viewsController.getOverview
);
router.get(
  "/myCart",
  authController.isLoggedIn,
  allowBuyer,
  viewsController.getCart
);
router.get(
  "/checkOut",
  authController.isLoggedIn,
  allowBuyer,
  viewsController.getCheckOut
);
router.get("/myOrders", authController.isLoggedIn, viewsController.getOrders);
router.get(
  "/negotiate",
  authController.isLoggedIn,
  allowBuyer,
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
  allowBuyer,
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
  "/seller_addProduct",
  setUser,
  authController.isLoggedIn,
  viewsController.sellerAddProduct
);
router.get(
  "/seller_negotiate",
  authController.isLoggedIn,
  viewsController.sellergetNegotiations
);

module.exports = router;
