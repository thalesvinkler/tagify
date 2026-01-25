import { NextResponse } from 'next/server';
import { fetchPayment } from '@/lib/mercadopago';
import { generatePng, generatePdf } from '@/lib/generator';
import { getOrder, markOrderApproved, saveDownload } from '@/lib/orders';
import { uploadFile } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentId = body?.data?.id ?? body?.id;

    if (!paymentId) {
      return NextResponse.json({ received: true });
    }

    const payment = await fetchPayment(String(paymentId));
    if (payment.status !== 'approved') {
      return NextResponse.json({ received: true });
    }

    const orderId = payment.external_reference;
    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const order = await getOrder(orderId);
    if (order.status === 'approved') {
      return NextResponse.json({ received: true });
    }

    const pngBuffer = await generatePng(order.payload);
    const pdfBuffer = await generatePdf(order.payload, pngBuffer);

    const pngPath = `orders/${orderId}/etiqueta.png`;
    const pdfPath = `orders/${orderId}/etiquetas.pdf`;

    await uploadFile(pngPath, pngBuffer, 'image/png');
    await uploadFile(pdfPath, pdfBuffer, 'application/pdf');

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

    await saveDownload(orderId, pdfPath, expiresAt);
    await markOrderApproved(orderId, String(paymentId));

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error', error);
    return NextResponse.json({ error: 'Webhook falhou' }, { status: 500 });
  }
}
