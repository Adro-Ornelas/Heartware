const express = require('express');
const { createOrder, getOrdersByUser } = require('../controllers/orders.controller');

const router = express.Router();

router.get('/orders/user/:id_user', getOrdersByUser);
router.post('/orders', createOrder);

module.exports = router;
