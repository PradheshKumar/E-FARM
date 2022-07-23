const express = require("express");
// const BuyerController = require('./../Controllers/BuyerController');
const authController = require("../Controllers/authController");
const userController = require("../Controllers/userController");
const router = express.Router();
const setUser = (req, res, next) => {
  res.locals.user = "buyer";
  next();
};
router.get("/", setUser, userController.getAllUsers);
router.post("/signup", setUser, authController.signup);
router.post("/login", setUser, authController.login);
router.get("/logout", setUser, authController.logout);

router.post("/forgotPassword", setUser, authController.forgotPassword);
router.patch("/resetPassword/:token", setUser, authController.resetPassword);

// Protect all routes after this middleware
router.use(setUser, authController.protect);
// router.use(authController.restrictTo("buyer"));

router.post("/addCart/:id/:qty", setUser, userController.addToCart);
router.patch("/updateCart/:id/:qty", setUser, userController.updateCart);
router.patch("/rmCart/:id", setUser, userController.rmCart);
router.patch("/updateMyPassword", setUser, authController.updatePassword);
router.get("/me", setUser, userController.getMe, userController.getUser);
router.patch("/updateMe", setUser, userController.updateMe);
router.delete("/deleteMe", setUser, userController.deleteMe);

// .post(userController.createUser);

router
  .route("/:id")
  .get(setUser, userController.getUser)
  .patch(setUser, userController.updateUser)
  .delete(setUser, userController.deleteUser);

module.exports = router;
