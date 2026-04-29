export interface PaypalConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

export const paypalConfig: PaypalConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID || '',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  baseUrl: process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com',
};

export function validatePaypalConfig(): void {
  if (!paypalConfig.clientId || !paypalConfig.clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET deben estar definidos en el entorno');
  }
}
