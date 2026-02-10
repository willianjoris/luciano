# 📚 Plataforma de E-books — Deploy no Vercel (100% gratuito)

Guia completo para colocar **frontend + backend** no ar usando **só o Vercel** (totalmente grátis).

---

## 📁 Estrutura do projeto

```
/
├── index.html              ← site completo (landing page + admin)
├── package.json            ← dependências (pg, jsonwebtoken)
├── vercel.json             ← configuração do Vercel
├── .env.example            ← template de variáveis de ambiente
├── db/
│   └── migration.sql       ← cria as tabelas no banco
└── api/
    ├── _db.js              ← conexão com PostgreSQL
    ├── _auth.js            ← middleware JWT
    ├── apileads.js            ← POST /api/leads
    ├── apiebooks.js           ← GET /api/ebooks
    ├── apicliques.js          ← POST /api/cliques
    └── admin/
        ├── login.js        ← POST /api/admin/login
        ├── leads.js        ← GET /api/admin/leads
        ├── ebooks.js       ← GET/POST/PUT /api/admin/ebooks
        └── relatorio.js    ← GET /api/admin/relatorio
```

---

## ✅ PASSO 1 — Criar banco de dados no Supabase

1. Acesse **https://supabase.com** e crie uma conta gratuita.
2. Clique em **"New Project"**.
3. Dê um nome (ex: `ebook-platform`) e **defina uma senha** para o banco.
4. Espere criar (leva uns 30 segundos).
5. Vá até **Settings → Database → Connection String → URI**.
6. Copie a URL completa que começa com `postgresql://...` (você vai precisar dela).

### Rodando a migration (cria as tabelas)

1. No painel do Supabase, clique em **SQL Editor** (menu da esquerda).
2. Abra o arquivo `db/migration.sql` neste projeto no seu editor.
3. Copie **todo o conteúdo** e cole no SQL Editor do Supabase.
4. Clique **Run** (▶).
5. Se aparecer "Success" — as 4 tabelas foram criadas + o primeiro e-book foi inserido. ✅

---

## ✅ PASSO 2 — Fazer deploy no Vercel

1. Acesse **https://vercel.com** e crie uma conta (pode usar conta do GitHub).
2. Faça upload do projeto:
   - **Opção A:** Suba o código para um repositório no GitHub e conecte ao Vercel.
   - **Opção B:** Faça deploy direto fazendo upload da pasta (Vercel CLI ou interface).
3. Na hora de configurar o deploy, **não precisa alterar nada** — o Vercel detecta automaticamente.

### Adicionando as variáveis de ambiente

No painel do Vercel, vá até **Settings → Environment Variables** e adicione:

| Nome | Valor |
|---|---|
| `DATABASE_URL` | A Connection String do Supabase que você copiou no Passo 1 |
| `JWT_SECRET` | Uma string aleatória longa (gere em https://www.uuidgenerator.net/) |
| `ADMIN_USER` | O login que você quer (ex: `adm`) |
| `ADMIN_PASS` | Uma senha forte (guarde bem!) |

4. Clique **Save** e depois **Redeploy** (botão no topo) para aplicar as variáveis.

---

## ✅ PASSO 3 — Configurar seu domínio

1. No painel do Vercel, vá até **Settings → Domains**.
2. Clique **Add** e digite o domínio que você já tem.
3. O Vercel vai te dar instruções de como configurar o DNS:
   - Geralmente é adicionar um registro **A** ou **CNAME** apontando pro Vercel.
4. Espere propagação do DNS (pode levar até 24h, mas geralmente é rápido).

**Pronto!** Seu site vai estar rodando em `https://seu-dominio.com.br`

---

## ✅ PASSO 4 — Testar tudo

Abre o site no navegador:

1. **Visitante:** clica "Quero acessar o ebook" → preenche nome e e-mail → vê os links → clica num link.
2. **Admin:** clica no logotipo 📚 no canto superior esquerdo → faz login → vê os leads.
3. **Novo e-book:** no admin, vai na tab "Novo E-book" e cadastra outro livro.
4. **Relatório:** tab "Relatório" → escolhe datas → clica "Gerar" → baixa o CSV.

---

## 🔧 Rodar localmente (desenvolvimento)

Você não consegue rodar as funções serverless localmente sem o Vercel CLI, mas pode instalar:

```bash
npm install -g vercel
vercel dev
```

Isso roda um servidor local que simula o ambiente do Vercel.

---

## 💰 Custos

- **Supabase:** R$ 0 (tier gratuito — 500 MB de banco)
- **Vercel:** R$ 0 (tier gratuito — 100 GB de banda/mês)
- **Domínio:** ~R$ 50-80/ano (compra uma vez, renova anual)

**Total:** ~R$ 5-7/mês (só o domínio).

---

## 📝 Notas importantes

- **Vercel Serverless:** cada rota da API é uma função independente. Elas "acordam" quando alguém acessa (demora ~100ms no primeiro acesso).
- **Senha do admin:** está nas variáveis de ambiente do Vercel. Nunca coloca no código.
- **JWT:** expira em 4 horas. Quando o admin sai da página, perde o token (segurança).
- **Banco de dados:** o Supabase é PostgreSQL gerenciado. Você pode acessar direto pelo painel deles para consultas SQL.

