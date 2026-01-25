import Link from 'next/link';

export default function PendentePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Pagamento pendente</h1>
      <p className="text-slate-300">
        Seu pagamento ainda está em processamento. Assim que for aprovado, você receberá o link para
        download.
      </p>
      <Link href="/" className="text-sm text-slate-400">
        Voltar para a página inicial
      </Link>
    </main>
  );
}
