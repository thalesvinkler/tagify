import CheckoutForm from '@/components/CheckoutForm';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-[-12rem] top-[6rem] h-[32rem] w-[32rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.07),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:4px_4px]" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">
            Etiqueta personalizada
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            Crie sua etiqueta de identificação
            <span className="block text-emerald-400">em segundos.</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Ideal para atletas, esportes de risco e identificação pessoal.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            {[
              'Entrega automática após pagamento',
              'PDF A4 com várias etiquetas',
              'PNG em alta qualidade',
              'Download seguro e privado'
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative">
          <div className="absolute -inset-3 rounded-[32px] border border-white/5 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-70" />
          <div className="relative rounded-[28px] border border-white/10 bg-slate-950/70 p-8 shadow-[0_25px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
            <CheckoutForm />
          </div>
        </section>
      </div>
    </main>
  );
}
