const express = require('express');
const orderController = require('./../Controllers/orderController');

const router = express.Router();

router.post('/newOrder', orderController.placeOrder);
router.get('/', orderController.getAllOrders);
router
  .route('/:id')
  .get(orderController.getOrder)
  .delete(orderController.deleteOrder);
module.exports = router;
