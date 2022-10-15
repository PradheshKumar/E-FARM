const express = require("express");
const viewsController = require("../Controllers/viewsController");
const authController = require("../Controllers/authController");
const productController = require("../Controllers/productController");
const userController = require("../Controllers/userController");

const router = express.Router();
// const setSeller = (req, res, next) => {
//   res.locals.user = "seller";
//   next();
// };
// const setBuyer = (req, res, next) => {
//   res.locals.user = "seller";
//   next();
// };
// router.use(viewsController.alerts);
function allowBuyer(req, res, next) {
  if (res.locals.user) {
    if (res.locals.user.role == "seller" ) {
      res.status(401).redirect("/farmOverview");
      // .json({
      //   status: "Permission denied",
      //   message: "Your Are Not allowed to use this route . Redirecting....",
      // });
    } 
    else if(res.locals.user.role =="farmSeller")
    {res.status(401).redirect("/account");
    }else next();
  }
  if (res.locals.user == null) next();
}
function allowSeller(req, res, next) {
  if (!res.locals.user || res.locals.user.role != "seller") {
    res.status(401).redirect("/");
    // .json({
    //   status: "Permission denied",
    //   message: "Your Are Not allowed to use this route . Redirecting....",
    // });
  } else next();
}

router.get(
  "/",
  authController.isLoggedIn,
  allowBuyer,
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
  "/farmOverview",
  authController.isLoggedIn,
  allowSeller,
  viewsController.getfarmOverview
);
router.get("/myCart", authController.isLoggedIn, viewsController.getCart);
router.get("/checkOut", authController.isLoggedIn, viewsController.getCheckOut);
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
router.get(
  "/farmProduct/:fid",
  authController.isLoggedIn,
  allowSeller,
  viewsController.getProduct
);
router.get(
  "/productsWithin/:latlngDist",
  authController.isLoggedIn,
  allowBuyer,
  viewsController.withinRange
);
router.get(
  "/farmProductsWithin/:latlgDist",
  authController.isLoggedIn,
  allowSeller,
  viewsController.withinRange
);
router.get("/login", viewsController.getLoginForm);
router.get(
  "/search/:key",

  authController.isLoggedIn,
  allowBuyer,
  viewsController.searchProduct
);
router.get(
  "/farmSearch/:key",
  authController.isLoggedIn,
  viewsController.searchFarmProduct
);

router.get(
  "/order_placed/:id",
  authController.isLoggedIn,
  viewsController.getOrderPlaced
);
router.get(
  "/viewOrder/:id",
  authController.isLoggedIn,
  viewsController.viewOrder
);
router.get(
  "/editAccount",
  authController.isLoggedIn,
  viewsController.getEditAccount
);
router.get("/resetPassword/:token", viewsController.getForgotPassword);
/////////////////////SELLER ROUTES
router.get(
  "/seller-login",
  (req, res, next) => {
    res.locals.currentUrl = "seller";
    next();
  },
  viewsController.getLoginForm
);
router.get(
  "/seller_products",
  authController.isLoggedIn,
  viewsController.sellerProducts
);
router.get(
  "/seller_addProduct",
  authController.isLoggedIn,
  viewsController.sellerAddProduct
);
router.get(
  "/rent/:id",
  authController.isLoggedIn,
  allowSeller,
  viewsController.getRentPage
);
router.get(
  "/seller_negotiate",
  authController.isLoggedIn,
  allowSeller,
  viewsController.sellergetNegotiations
);
router.get("/MyRents", authController.isLoggedIn, viewsController.getMyRents);
router.get("/demand",authController.isLoggedIn,
allowSeller,
viewsController.getDemand);
router.get("/weather",authController.isLoggedIn,
allowSeller,
viewsController.getWeather);

module.exports = router;
