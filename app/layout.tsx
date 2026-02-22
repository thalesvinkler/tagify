import './globals.css';
import type { ReactNode } from 'react';
import { Manrope, Oxanium, Space_Grotesk } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display'
});

const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-label'
});

export const metadata = {
  title: 'Tagify - Gerador de Etiquetas',
  description: 'Gerador de etiquetas com checkout e entrega automática.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} ${oxanium.variable} min-h-screen bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
