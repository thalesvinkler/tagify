'use client';

import { useState } from 'react';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-200" htmlFor="name">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
          placeholder="João Silva"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200" htmlFor="country">
          País
        </label>
        <input
          id="country"
          name="country"
          required
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
          placeholder="Brasil"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200" htmlFor="bloodType">
          Tipo sanguíneo
        </label>
        <select
          id="bloodType"
          name="bloodType"
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
          required
          defaultValue=""
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

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {loading ? 'Redirecionando...' : 'Comprar'}
      </button>
    </form>
  );
}
