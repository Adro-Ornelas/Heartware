// const express = require('express');
// const router = express.Router();
// const  getProducts = require('../controllers/products.controller');

// // On URL ../prodcuts
// router.get('/products', getProducts);

// module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller'); // Ajusta la ruta a tu archivo

// Definición de endpoints
router.get('/products', productController.getProducts);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.post('/products/upload', productController.uploadMiddleware, productController.uploadImage);

module.exports = router;