const express = require("express");
const rentController = require("../Controllers/rentController");
const orderController = require("../Controllers/orderController");

const router = express.Router();
router.post("/createRent", rentController.addPrice, rentController.createRent);
router.patch("/startRentDate/:id", rentController.startRentDate);
router.patch("/endRentDate/:id", rentController.endRentDate);
// route.post('/placeBid', rentController.CreateBid);
router.get("/", rentController.getAllRent);
router.get("/:id", rentController.getRent);
router.delete("/:id", rentController.deleteRent);

module.exports = router;
