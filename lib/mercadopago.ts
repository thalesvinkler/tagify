export interface MercadoPagoPreference {
  items: Array<{
    title: string;
    quantity: number;
    currency_id: string;
    unit_price: number;
  }>;
  payer: {
    name: string;
    email?: string;
  };
  external_reference: string;
  notification_url: string;
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
}

export interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
}

const mercadoPagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN ?? '';

export async function createPreference(preference: MercadoPagoPreference) {
  if (!mercadoPagoToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado.');
  }

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mercadoPagoToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preference)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Erro ao criar preferência: ${message}`);
  }

  return (await response.json()) as MercadoPagoPreferenceResponse;
}

export async function fetchPayment(paymentId: string) {
  if (!mercadoPagoToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado.');
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${mercadoPagoToken}`
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Erro ao consultar pagamento: ${message}`);
  }

  return response.json();
}
