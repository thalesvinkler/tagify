import Link from 'next/link';
import { generatePng } from '@/lib/generator';
import { getOrder } from '@/lib/orders';

interface PageProps {
  searchParams: { order?: string };
}

export default async function SucessoPage({ searchParams }: PageProps) {
  const orderId = searchParams.order;
  let previewDataUrl: string | null = null;

  if (orderId) {
    try {
      const order = await getOrder(orderId);
      const previewBuffer = await generatePng(order.payload);
      previewDataUrl = `data:image/png;base64,${previewBuffer.toString('base64')}`;
    } catch (error) {
      console.warn('Falha ao gerar preview na pagina de sucesso', { orderId, error });
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Pagamento aprovado!</h1>
      {previewDataUrl ? (
        <img
          src={previewDataUrl}
          alt="Preview da etiqueta"
          className="w-full rounded-xl border border-white/10 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)]"
        />
      ) : null}
      <p className="text-slate-300">
        Estamos gerando seu arquivo. Se ja estiver pronto, faca o download no link abaixo.
      </p>
      {orderId ? (
        <Link
          href={`/api/download/${orderId}`}
          className="rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-900"
        >
          Baixar arquivo
        </Link>
      ) : null}
      <Link href="/" className="text-sm text-slate-400">
        Voltar para a pagina inicial
      </Link>
    </main>
  );
}
