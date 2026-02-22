'use client';

import { useState } from 'react';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const countries = [
  'Antigua e Barbuda',
  'Argentina',
  'Bahamas',
  'Barbados',
  'Belize',
  'Bolivia',
  'Brasil',
  'Canada',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Dominica',
  'Equador',
  'El Salvador',
  'Estados Unidos',
  'Granada',
  'Guatemala',
  'Guiana',
  'Haiti',
  'Honduras',
  'Jamaica',
  'Mexico',
  'Nicaragua',
  'Panama',
  'Paraguai',
  'Peru',
  'Republica Dominicana',
  'Sao Cristovao e Nevis',
  'Santa Lucia',
  'Sao Vicente e Granadinas',
  'Suriname',
  'Trinidad e Tobago',
  'Uruguai',
  'Venezuela'
];
const countryFlagCodes: Record<string, string> = {
  'Antigua e Barbuda': 'ag',
  Argentina: 'ar',
  Bahamas: 'bs',
  Barbados: 'bb',
  Belize: 'bz',
  Bolivia: 'bo',
  Brasil: 'br',
  Canada: 'ca',
  Chile: 'cl',
  Colombia: 'co',
  'Costa Rica': 'cr',
  Cuba: 'cu',
  Dominica: 'dm',
  Equador: 'ec',
  'El Salvador': 'sv',
  'Estados Unidos': 'us',
  Granada: 'gd',
  Guatemala: 'gt',
  Guiana: 'gy',
  Haiti: 'ht',
  Honduras: 'hn',
  Jamaica: 'jm',
  Mexico: 'mx',
  Nicaragua: 'ni',
  Panama: 'pa',
  Paraguai: 'py',
  Peru: 'pe',
  'Republica Dominicana': 'do',
  'Sao Cristovao e Nevis': 'kn',
  'Santa Lucia': 'lc',
  'Sao Vicente e Granadinas': 'vc',
  Suriname: 'sr',
  'Trinidad e Tobago': 'tt',
  Uruguai: 'uy',
  Venezuela: 've'
};

function getCountryFlag(country: string) {
  const code = countryFlagCodes[country] ?? 'br';
  return `https://flagcdn.com/${code}.svg`;
}

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
            placeholder="Seu nome aqui"
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
            <div className="absolute left-[9.5%] top-[18%] h-[58%] w-[20.1%] origin-left skew-x-[-29deg] overflow-hidden rounded-[4px] shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
              <img
                src={getCountryFlag(previewCountry)}
                alt={`Bandeira ${previewCountry}`}
                className="h-full w-full object-cover"
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
