import { NextResponse } from 'next/server';
import { createSignedUrl } from '@/lib/storage';
import { getDownload, incrementDownloadCount } from '@/lib/orders';

export async function GET(_request: Request, context: { params: { orderId: string } }) {
  try {
    const { orderId } = context.params;
    const download = await getDownload(orderId);
    const expiresAt = new Date(download.expires_at);

    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: 'Link expirado.' }, { status: 410 });
    }

    const signedUrl = await createSignedUrl(download.file_path, 60 * 60);
    await incrementDownloadCount(orderId);

    return NextResponse.redirect(signedUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao baixar.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
