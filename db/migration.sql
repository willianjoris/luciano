-- ============================================================
-- MIGRATION — Plataforma de E-books
-- Rodar UMA VEZ no Supabase → SQL Editor
-- ============================================================

-- 1. Leads capturados pela LP
CREATE TABLE IF NOT EXISTS leads (
  id              SERIAL PRIMARY KEY,
  nome            VARCHAR(120)  NOT NULL,
  email           VARCHAR(200)  NOT NULL UNIQUE,
  aceita_newsletter BOOLEAN     DEFAULT false,
  criado_em       TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email    ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_criado   ON leads (criado_em DESC);

-- 2. Cadastro de e-books
CREATE TABLE IF NOT EXISTS ebooks (
  id           SERIAL PRIMARY KEY,
  titulo       VARCHAR(200)  NOT NULL,
  autor        VARCHAR(150),
  descricao    TEXT,
  imagem_url   VARCHAR(500),
  ativo        BOOLEAN       DEFAULT true,
  criado_em    TIMESTAMPTZ   DEFAULT NOW()
);

-- 3. Links de compra por plataforma (1 e-book pode ter N links)
CREATE TABLE IF NOT EXISTS links_compra (
  id            SERIAL PRIMARY KEY,
  ebook_id      INTEGER       NOT NULL REFERENCES ebooks(id) ON DELETE CASCADE,
  plataforma    VARCHAR(60)   NOT NULL,   -- ex: "Amazon Kindle", "Hotmart"
  url           TEXT          NOT NULL,
  total_cliques INTEGER       DEFAULT 0,
  criado_em     TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_links_ebook ON links_compra (ebook_id);

-- 4. Log detalhado de cliques (permite filtro por data no relatório)
CREATE TABLE IF NOT EXISTS cliques (
  id              SERIAL PRIMARY KEY,
  link_compra_id  INTEGER     NOT NULL REFERENCES links_compra(id) ON DELETE CASCADE,
  lead_id         INTEGER     REFERENCES leads(id) ON DELETE SET NULL,  -- pode ser NULL se visitante não preencheu
  ip_visitante    INET,
  clicado_em      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cliques_link     ON cliques (link_compra_id);
CREATE INDEX IF NOT EXISTS idx_cliques_clicado  ON cliques (clicado_em DESC);

-- ============================================================
-- SEED — primeiro e-book (dados do template existente)
-- ============================================================
INSERT INTO ebooks (titulo, autor, descricao, imagem_url, ativo)
VALUES (
  'Transforme Seu Corpo com Ciência e Cuidado',
  'Erik dos Santos & Matheus da Silveira',
  'Ebook para quem quer emagrecer com apoio de ativos farmacêuticos, entendendo melhor o que está usando.',
  NULL,
  true
)
ON CONFLICT DO NOTHING;

-- Links do primeiro e-book (id = 1 após insert acima)
INSERT INTO links_compra (ebook_id, plataforma, url)
VALUES
  (1, 'Google Play Livros', 'https://play.google.com/store/books/details/Matheus_L_R_da_Silveira_Transforme_seu_Corpo_com_C?id=WGSOEQAAQBAJ'),
  (1, 'Amazon Kindle',      'https://www.amazon.com.br/Transforme-Corpo-Ci%C3%AAncia-Cuidado-Emagrecimento-ebook/dp/B0FXD6158H/'),
  (1, 'Hotmart',            'https://pay.hotmart.com/K102333196V')
ON CONFLICT DO NOTHING;
