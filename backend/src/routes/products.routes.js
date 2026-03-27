const express = require('express');
const router = express.Router();
const  getProducts = require('../controllers/products.controller');

// On URL ../prodcuts
router.get('/products', getProducts);

module.exports = router;