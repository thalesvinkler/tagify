# Tagify MVP

Starter para um gerador de etiquetas com pagamento via Mercado Pago, geração de PNG/PDF no servidor e entrega automática via Supabase Storage.

## Requisitos

- Node.js 18+
- Projeto no Supabase (DB + Storage)
- Conta Mercado Pago

## Configuração

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

2. Atualize as variáveis em `.env.local`.

3. Crie as tabelas no Supabase usando o script abaixo.

```bash
cat database.sql
```

4. Rode o projeto:

```bash
npm install
npm run dev
```

## Fluxo do MVP

1. Usuário preenche o formulário na landing page.
2. `/api/checkout` cria o pedido no Supabase e a preferência no Mercado Pago.
3. Mercado Pago chama `/api/webhook` ao aprovar o pagamento.
4. O servidor gera PNG e PDF, envia ao Supabase Storage e grava o link de download.
5. O usuário baixa o arquivo em `/api/download/:orderId`.

## Próximos passos sugeridos

- Adicionar envio de e-mail com Resend
- Implementar preview com marca d'água
- Logar eventos com Plausible/PostHog
- Adicionar autenticação (opcional)

## Domínio e hospedagem (recomendado)

Para este MVP em Next.js, o caminho mais simples e econômico é:

1. **Hospedar o site na Vercel** (deploy automático, SSL grátis e integração nativa com Next.js).
2. **Comprar o domínio em um registrador confiável** e apontar para a Vercel.

Opções populares de domínio:
- **Registro.br** (melhor custo/benefício para `.com.br`)
- **Namecheap** ou **Cloudflare Registrar** (bons para `.com`, `.io`, etc.)

Se você já vai hospedar na Vercel, vale a pena comprar o domínio onde for mais barato e **apontar os DNS para a Vercel**, pois o SSL e a configuração de subdomínios ficam simplificados.
