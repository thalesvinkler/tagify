import { NextResponse } from 'next/server';
import { createSignedUrl } from '@/lib/storage';
import { getDownload, incrementDownloadCount } from '@/lib/orders';

export async function GET(_request: Request, context: { params: { orderId: string } }) {
  try {
    const { orderId } = context.params;
    const download = await getDownload(orderId);

    const signedUrl = await createSignedUrl(download.file_path, 60 * 60);
    await incrementDownloadCount(orderId);

    const response = NextResponse.redirect(signedUrl, 302);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao baixar.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
