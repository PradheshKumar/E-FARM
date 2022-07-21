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
// router.use(authController.protect);

router.patch("/updateMyPassword", setUser, authController.updatePassword);
router.get("/me", setUser, userController.getMe, userController.getUser);
router.patch("/updateMe", setUser, userController.updateMe);
router.delete("/deleteMe", setUser, userController.deleteMe);

// router.use(authController.restrictTo('admin'));

// .post(userController.createUser);

router
  .route("/:id")
  .get(setUser, userController.getUser)
  .patch(setUser, userController.updateUser)
  .delete(setUser, userController.deleteUser);

module.exports = router;
