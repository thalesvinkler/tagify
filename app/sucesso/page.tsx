import Link from 'next/link';

interface PageProps {
  searchParams: { order?: string };
}

export default function SucessoPage({ searchParams }: PageProps) {
  const orderId = searchParams.order;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Pagamento aprovado!</h1>
      <p className="text-slate-300">
        Estamos gerando seu arquivo. Se já estiver pronto, faça o download no link abaixo.
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
        Voltar para a página inicial
      </Link>
    </main>
  );
}
