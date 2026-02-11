'use client';

import { useState } from 'react';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const countries = ['Brasil', 'Portugal', 'Estados Unidos', 'Argentina', 'Chile'];
const countryFlags: Record<string, string> = {
  Brasil: '/flags/br.svg',
  Portugal: '/flags/pt.svg',
  'Estados Unidos': '/flags/us.svg',
  Argentina: '/flags/ar.svg',
  Chile: '/flags/cl.svg'
};

export default function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState('');
  const [previewBloodType, setPreviewBloodType] = useState('');
  const [previewCountry, setPreviewCountry] = useState('Brasil');

  const trimmedName = previewName.trim();
  const isLongName = trimmedName.length > 10;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get('name'),
      country: formData.get('country'),
      bloodType: formData.get('bloodType')
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Não foi possível iniciar o pagamento.');
      }

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('Link de pagamento não retornado.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-semibold text-emerald-300/80">Gerar etiqueta</h2>
        <p className="text-sm text-slate-300">
          Preencha seus dados, pague via Pix ou cartão e receba o arquivo pronto para impressão automaticamente.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="name">
            Nome completo
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="Thales"
            onChange={(event) => setPreviewName(event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="country">
              País
            </label>
            <select
              id="country"
              name="country"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              required
              defaultValue="Brasil"
              onChange={(event) => setPreviewCountry(event.target.value)}
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="bloodType">
              Tipo sanguíneo
            </label>
            <select
              id="bloodType"
              name="bloodType"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              required
              defaultValue=""
              onChange={(event) => setPreviewBloodType(event.target.value)}
            >
              <option value="" disabled>
                Selecione
              </option>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative w-full max-w-[360px]">
          <img
            src="/customize_label.png"
            alt="Exemplo de etiqueta personalizada"
            className="w-full bg-transparent drop-shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
          />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[9.4%] top-[18%] w-[23.2%]">
              <img
                src={countryFlags[previewCountry] ?? countryFlags.Brasil}
                alt={`Bandeira ${previewCountry}`}
                className="w-auto origin-left scale-x-[0.87] rounded-[8px] skew-x-[-29deg] shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
              />
            </div>
            <div
              className={`absolute left-[calc(42.7%-40px)] w-[38%] leading-[20px] text-center ${
                isLongName ? 'top-[30%]' : 'top-[38%]'
              }`}
            >
              <span className="font-label text-lg font-semibold italic uppercase leading-[20px] tracking-[0.14em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {previewName ? previewName : 'Nome'}
              </span>
            </div>
            <div className="absolute right-[calc(7.3%+5px)] top-[20%] w-[16%] text-center">
              <span className="font-label text-2xl font-semibold italic text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
       {previewBloodType ? previewBloodType : 'A+'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-900 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:bg-emerald-500/70"
      >
        {loading ? 'Processando...' : 'Gerar etiqueta'}
      </button>
    </form>
  );
}
