const express = require('express');
const negotiationController = require('./../Controllers/negotiationController');

const router = express.Router();
router.patch(
  '/placeBid/:id',
  negotiationController.addBuyerSeller,
  negotiationController.placeBid
);
router.post('/placeBid/', negotiationController.placeBid);
// route.post('/placeBid', negotiationController.CreateBid);
router.get('/', negotiationController.getAllBid);
router.get('/:id', negotiationController.getBid);
router.get('/reply/:token', negotiationController.redirectToReply);

module.exports = router;
