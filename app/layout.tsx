import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Tagify MVP',
  description: 'Gerador de etiquetas com checkout e entrega automática.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
