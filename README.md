# Sinuca dos Amigos

Site de marcação de pontos de sinuca para grupo de amigos. Next.js (App Router) + TypeScript + Tailwind, com Supabase (Postgres, Auth, Realtime).

## Configuração

1. Crie um projeto no [Supabase](https://supabase.com).
2. Rode as migrations em `supabase/migrations/` (SQL editor do Supabase ou `supabase db push` via CLI), na ordem `0001_schema.sql` e `0002_functions.sql`.
3. Copie `.env.local.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API no Supabase).
4. Instale as dependências e rode o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Regras

- Vitória vale 3 pontos, derrota vale 0.
- Partidas podem ser 1v1 ou 2v2 (duplas).
- Estatísticas de aproveitamento por dupla são calculadas por combinação única de dois jogadores, já que as duplas variam entre partidas.

## Deploy

Hospedado na [Vercel](https://vercel.com). Configure as mesmas variáveis de ambiente do `.env.local` no painel do projeto na Vercel.
