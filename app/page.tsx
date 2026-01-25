import CheckoutForm from '@/components/CheckoutForm';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-6 py-16">
      <section className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">MVP pronto para vender</p>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
          Gerador de etiquetas com pagamento Pix/cartão e entrega automática.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Preencha seus dados, pague via Mercado Pago e receba o arquivo em PDF e PNG. O sistema gera
          automaticamente após a confirmação do pagamento.
        </p>
      </section>

      <section className="grid gap-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Dados para gerar sua etiqueta</h2>
          <p className="text-slate-300">
            Este MVP cria um pedido, gera o arquivo no servidor e envia um link assinado para download.
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• Entrega automática após aprovação do pagamento</li>
            <li>• PDF A4 com várias etiquetas</li>
            <li>• PNG pronto para impressão ou colagem</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
          <CheckoutForm />
        </div>
      </section>
    </main>
  );
}
