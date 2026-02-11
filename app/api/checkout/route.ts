import { NextResponse } from 'next/server';
import { createPreference } from '@/lib/mercadopago';
import { createOrder } from '@/lib/orders';
import { validatePayload, type LabelPayload } from '@/lib/generator';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<LabelPayload>;

    if (!validatePayload(payload)) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    const order = await createOrder(payload);
    const preference = await createPreference({
      items: [
        {
          title: 'Etiqueta personalizada',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 9.9
        }
      ],
      payer: {
        name: payload.name
      },
      external_reference: order.id,
      notification_url: `${baseUrl}/api/webhook`,
      back_urls: {
        success: `${baseUrl}/sucesso?order=${order.id}`,
        failure: `${baseUrl}/erro?order=${order.id}`,
        pending: `${baseUrl}/pendente?order=${order.id}`
      }
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
