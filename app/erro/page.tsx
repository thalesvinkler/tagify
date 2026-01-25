import Link from 'next/link';

export default function ErroPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Pagamento não concluído</h1>
      <p className="text-slate-300">
        Não foi possível confirmar o pagamento. Você pode tentar novamente ou entrar em contato.
      </p>
      <Link href="/" className="rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-900">
        Tentar novamente
      </Link>
    </main>
  );
}
