import { paypalConfig } from '../config/paypal.config';

export interface PaypalOrderItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface CreatePaypalOrderPayload {
  total: number | string;
  items: PaypalOrderItem[];
}

/**
 * Codifica las credenciales en formato Base64.
 * Combina el ID de cliente y la contraseña secreta.
 */
function getBasicAuth(): string {
  return Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString('base64');
}

/**
 * Obtiene el token de acceso temporal de PayPal.
 */
export async function getAccessToken(): Promise<string> {
  console.log('PAYPAL CONFIG');
  console.log(paypalConfig);
  const response = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  console.log('TOKEN RESPONSE');
  console.log(data);

  if (!response.ok) {
    throw new Error(`Error obteniendo access token: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

/**
 * Crea una orden de pago enviando los detalles del carrito.
 */
export async function createPaypalOrder(orderData: CreatePaypalOrderPayload): Promise<unknown> {
  console.log('ORDER DATA');
  console.log(JSON.stringify(orderData, null, 2));
  const accessToken = await getAccessToken();
  console.log('TOKEN OBTENIDO');
  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'MXN',
          value: Number(orderData.total).toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'MXN',
              value: Number(orderData.total).toFixed(2),
            },
          },
        },
        items: orderData.items.map(item => ({
          name: item.nombre,
          quantity: String(item.cantidad),
          unit_amount: {
            currency_code: 'MXN',
            value: Number(item.precio).toFixed(2),
          },
        })),
      },
    ],
  };

  const response = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error creando orden PayPal: ${JSON.stringify(data)}`);
  }

  return data;
}

/**
 * Confirma y procesa el cobro final una vez que el usuario aprueba el pago.
 */
export async function capturePaypalOrder(orderId: string): Promise<unknown> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error capturando orden PayPal: ${JSON.stringify(data)}`);
  }

  return data;
}
