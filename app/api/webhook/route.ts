import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { fetchPayment } from '@/lib/mercadopago';
import { generatePng, generatePdf } from '@/lib/generator';
import { getOrder, markOrderApproved, saveDownload } from '@/lib/orders';
import { uploadFile } from '@/lib/storage';

function parseSignatureHeader(signatureHeader: string | null) {
  if (!signatureHeader) return null;
  const parts = signatureHeader.split(',');
  let ts = '';
  let v1 = '';

  for (const part of parts) {
    const [rawKey, rawValue] = part.split('=');
    const key = rawKey?.trim();
    const value = rawValue?.trim();
    if (!key || !value) continue;
    if (key === 'ts') ts = value;
    if (key === 'v1') v1 = value;
  }

  if (!ts || !v1) return null;
  return { ts, v1 };
}

function isValidSignature(params: {
  secret: string;
  ts: string;
  v1: string;
  requestId: string;
  dataIdUrl: string;
}) {
  const manifest = `id:${params.dataIdUrl};request-id:${params.requestId};ts:${params.ts};`;
  const hash = createHmac('sha256', params.secret).update(manifest).digest('hex');

  const expected = new Uint8Array(Buffer.from(hash, 'hex'));
  const received = new Uint8Array(Buffer.from(params.v1, 'hex'));
  if (expected.length !== received.length) return false;

  return timingSafeEqual(expected, received);
}

async function processPaymentWebhook(paymentId: string) {
  console.log('>> >> Fetching payment details', { paymentId });
  // let payment: Awaited<ReturnType<typeof fetchPayment>>;
  // try {
  //   payment = await fetchPayment(paymentId);
  //   console.log('Payment fetched successfully', { paymentId, status: payment.status });
  // } catch (error) {
  //   // Mercado Pago URL test often sends dummy IDs (e.g. 123456).
  //   console.warn('Webhook payment fetch failed', { paymentId, error });
  //   return;
  // }

  // if (payment.status !== 'approved') {
  //   return;
  // }

  // const orderId = payment.external_reference;
  // if (!orderId) {
  //   return;
  // }

  const orderId = '8b133835-6be3-4f39-bec9-10e1e629f5c0'; // For testing, we use paymentId as orderId. Replace with payment.external_reference in production.
  const order = await getOrder(orderId);
  console.log('Order details fetched', { orderId, status: order.status });
  if (order.status !== 'approved') {
    return;
  }
  console.log('>> >> Generating files and updating order status', { orderId });
  const pngBuffer = await generatePng(order.payload);
  const pdfBuffer = await generatePdf(order.payload, pngBuffer);

  const pngPath = `orders/${orderId}/etiqueta.png`;
  const pdfPath = `orders/${orderId}/etiquetas.pdf`;

  await uploadFile(pngPath, pngBuffer, 'image/png');
  await uploadFile(pdfPath, pdfBuffer, 'application/pdf');

  await saveDownload(orderId, pdfPath);
  await markOrderApproved(orderId, paymentId);
  console.log('>> >> Webhook processing completed', { orderId, paymentId });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentId = String(body?.data?.id ?? body?.id ?? '');
    const type = String(body?.type ?? '');

    if (type !== 'payment' || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET ?? '';
    if (!secret) {
      console.warn('Webhook signature validation skipped: MERCADOPAGO_WEBHOOK_SECRET not set');
    } else {
      const url = new URL(request.url);
      const dataIdUrl = url.searchParams.get('data.id') ?? url.searchParams.get('id') ?? '';
      const requestId = request.headers.get('x-request-id') ?? '';
      const parsed = parseSignatureHeader(request.headers.get('x-signature'));

      if (!dataIdUrl || !requestId || !parsed) {
        return NextResponse.json({ error: 'Assinatura invalida.' }, { status: 401 });
      }

      const valid = isValidSignature({
        secret,
        ts: parsed.ts,
        v1: parsed.v1,
        requestId,
        dataIdUrl
      });

      if (!valid) {
        return NextResponse.json({ error: 'Assinatura invalida.' }, { status: 401 });
      }
    }
    console.log('>> >> Webhook received valid payment event', { paymentId });

    console.log('>> >> Starting webhook background processing', { paymentId });
    void processPaymentWebhook(paymentId).catch((error) => {
      console.error('Webhook background processing error', { paymentId, error });
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error', error);
    return NextResponse.json({ received: true });
  }
}
