import { Request, Response, NextFunction } from 'express';
import { createPaypalOrder, capturePaypalOrder, CreatePaypalOrderPayload } from '../services/paypal.service';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderData = req.body as CreatePaypalOrderPayload;
    const order = await createPaypalOrder(orderData);
    // Normalizar respuesta: devolver sólo el id de la orden para el cliente
    const id = (order as any)?.id || null;
    return res.status(201).json({ id });
  } catch (error) {
    next(error);
  }
};

export const captureOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const result = await capturePaypalOrder(orderId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
