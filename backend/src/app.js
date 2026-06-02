const express = require('express');
const cors = require('cors');
const productsRoutes = require('./routes/products.routes');
const ordersRoutes = require('./routes/orders.routes');
const usersRoutes = require('./routes/users.routes');
const { errorHandler } = require('./middleware/error.middleware');
const path = require('path');
const app = express();

// Serve images
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use(cors());
app.use(express.json());

const paypalRoutes = require('./routes/paypal.routes.ts');
const authRoutes = require('./routes/auth.routes.js');

app.get('/', (req, res) => {
  res.json({
    message: 'Backend API en ejecucion',
    endpoints: ['/health', '/api/productos', '/api/products', '/api/users/:id_user', '/api/orders', '/api/orders/user/:id_user', '/api/paypal/create-order', '/api/paypal/capture-order/:orderId'],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', productsRoutes);
app.use('/api', ordersRoutes);
app.use('/api', usersRoutes);
app.use('/api/paypal', paypalRoutes.paypalRouter);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

module.exports = app;

// http://localhost:3000/api/products
