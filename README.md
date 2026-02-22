# Tagify

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

## Fluxo do App

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
