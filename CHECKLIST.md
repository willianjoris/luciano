# ✅ Checklist — Plataforma de E-books

## 🖥️ Código (já feito)

- [x] Tabelas SQL (leads, ebooks, links_compra, cliques) + seed do primeiro livro
- [x] API Serverless: POST /api/leads — captura nome + email
- [x] API Serverless: GET /api/ebooks — retorna livros ativos com links
- [x] API Serverless: POST /api/cliques — registra clique + incrementa contador
- [x] API Serverless: POST /api/admin/login — autentica e retorna JWT
- [x] API Serverless: GET /api/admin/leads — lista leads paginado
- [x] API Serverless: GET/POST/PUT /api/admin/ebooks — CRUD de e-books
- [x] API Serverless: GET /api/admin/relatorio — gera CSV com filtro de data
- [x] Middleware JWT para rotas admin
- [x] Frontend: LP completa (hero, cards, CTA, autores) — estilo do template original
- [x] Frontend: formulário de lead → chama API
- [x] Frontend: página de links de compra → rastreia clique antes de redirecionar
- [x] Frontend: admin login → dashboard com tabs
- [x] Frontend: tab Leads — tabela com dados da API
- [x] Frontend: tab E-books — lista dos livros cadastrados com cliques
- [x] Frontend: tab Novo E-book — formulário com links dinâmicos
- [x] Frontend: tab Relatório — seletores de data + download CSV
- [x] Frontend: tema claro/escuro
- [x] Frontend: responsivo mobile
- [x] Configuração Vercel (vercel.json) — frontend + API no mesmo domínio
- [x] README com passo a passo de deploy no Vercel

---

## 🚶 Você precisa fazer (na ordem)

- [ ] **1.** Criar conta no **Supabase** (https://supabase.com) — banco PostgreSQL gratuito
- [ ] **2.** Criar um projeto no Supabase e copiar a **Connection String (URI)**
- [ ] **3.** Rodar o **migration.sql** no SQL Editor do Supabase (cria as 4 tabelas + insere o primeiro livro)
- [ ] **4.** *(Opcional)* Criar repositório no **GitHub** e subir o código
- [ ] **5.** Criar conta no **Vercel** (https://vercel.com)
- [ ] **6.** Fazer deploy do projeto no Vercel (conecta GitHub ou faz upload direto)
- [ ] **7.** Adicionar as 4 variáveis de ambiente no Vercel:
  - `DATABASE_URL` → Connection String do Supabase
  - `JWT_SECRET` → String aleatória longa (gere em uuidgenerator.net)
  - `ADMIN_USER` → Login do admin (ex: `adm`)
  - `ADMIN_PASS` → Senha forte (guarde bem!)
- [ ] **8.** Clicar **Redeploy** no Vercel para aplicar as variáveis
- [ ] **9.** Testar o site na URL do Vercel (ex: `https://seu-projeto.vercel.app`)
- [ ] **10.** Configurar seu domínio no Vercel: **Settings → Domains → Add**
- [ ] **11.** Configurar o DNS do seu domínio apontando pro Vercel (instruções aparecem lá)
- [ ] **12.** Testar tudo de novo no domínio personalizado

---

## 📌 Credenciais do Admin

Definidas nas variáveis de ambiente do Vercel:
- **Login:** valor de `ADMIN_USER`
- **Senha:** valor de `ADMIN_PASS`

**Como acessar:** clica no logotipo 📚 no canto superior esquerdo do site → tela de login.

---

## 💡 Vantagens dessa arquitetura

✅ **Tudo no mesmo lugar** — frontend e API no Vercel, sem precisar de 2 serviços  
✅ **100% gratuito** — só paga o domínio (~R$5-7/mês)  
✅ **Deploy automático** — conecta GitHub e cada commit atualiza o site  
✅ **HTTPS automático** — SSL gratuito em qualquer domínio  
✅ **Escalável** — Vercel aguenta milhares de acessos no tier free
