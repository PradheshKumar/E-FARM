const express = require("express");
const productController = require("../Controllers/productController");
const authController = require("../Controllers/authController");

const router = express.Router();

router.route("/").get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);
router.get(
  "/productsWithin/:distance/center/:latlng",
  productController.getProductsWithin
);
router.post("/addImages");
router.post(
  "/addProduct",
  authController.isLoggedIn,
  productController.addProductSeller,
  productController.uploadImages,
  productController.resizeImage,
  productController.addLocation,
  productController.addProduct,
  productController.ProductToSeller
);
router.get("/search/:key", productController.searchProduct);
// Protect all routes after this middleware
router.use(authController.protect);

router.use(authController.restrictTo("seller"));

module.exports = router;
