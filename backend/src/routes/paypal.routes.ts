import express from 'express';
import { createOrder, captureOrder } from '../controllers/paypal.controller';
import { paypalConfig } from '../config/paypal.config';

export const paypalRouter = express.Router();

// Endpoint para exponer solo el clientId al frontend (seguro)
paypalRouter.get('/config', (_req, res) => {
	res.json({ clientId: paypalConfig.clientId });
});

paypalRouter.post('/create-order', createOrder);
paypalRouter.post('/capture-order/:orderId', captureOrder);
