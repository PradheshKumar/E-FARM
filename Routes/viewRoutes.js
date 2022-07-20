const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getIndex);
router.get('/overview', authController.isLoggedIn, viewsController.getOverview);

router.get('/product/:id', viewsController.getProduct);
router.get('/login', viewsController.getLoginForm);

module.exports = router;
