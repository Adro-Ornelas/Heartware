const express = require('express');
const { createOrder, getOrdersByUser, getAllOrders } = require('../controllers/orders.controller');

const router = express.Router();

router.get('/orders/user/:id_user', getOrdersByUser);
router.get('/orders/all', getAllOrders);
router.post('/orders', createOrder);

module.exports = router;
