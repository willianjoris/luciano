const { getPool } = require('../_db');
const { requireAuth } = require('../_auth');

async function handler(req, res) {
  const pool = getPool();

  // ─── GET: lista todos os e-books (ativos + inativos) ───
  if (req.method === 'GET') {
    try {
      const { rows: ebooks } = await pool.query(
        `SELECT * FROM ebooks ORDER BY criado_em DESC`
      );

      const result = await Promise.all(
        ebooks.map(async (eb) => {
          const { rows: links } = await pool.query(
            `SELECT id, plataforma, url, total_cliques FROM links_compra WHERE ebook_id = $1 ORDER BY id`,
            [eb.id]
          );
          return { ...eb, links };
        })
      );

      return res.json(result);
    } catch (err) {
      console.error('GET /api/admin/ebooks →', err.message);
      return res.status(500).json({ erro: 'Erro interno.' });
    }
  }

  // ─── POST: cadastra novo e-book ───
  if (req.method === 'POST') {
    const client = await pool.connect();
    try {
      const { titulo, autor, descricao, imagem_url, links } = req.body;

      if (!titulo) return res.status(400).json({ erro: 'Título é obrigatório.' });
      if (!links || !links.length) return res.status(400).json({ erro: 'Pelo menos um link é necessário.' });

      await client.query('BEGIN');

      const { rows } = await client.query(
        `INSERT INTO ebooks (titulo, autor, descricao, imagem_url) VALUES ($1,$2,$3,$4) RETURNING id`,
        [titulo, autor || null, descricao || null, imagem_url || null]
      );
      const ebookId = rows[0].id;

      for (const link of links) {
        if (link.plataforma && link.url) {
          await client.query(
            `INSERT INTO links_compra (ebook_id, plataforma, url) VALUES ($1,$2,$3)`,
            [ebookId, link.plataforma.trim(), link.url.trim()]
          );
        }
      }

      await client.query('COMMIT');
      return res.status(201).json({ ok: true, ebook_id: ebookId });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('POST /api/admin/ebooks →', err.message);
      return res.status(500).json({ erro: 'Erro interno.' });
    } finally {
      client.release();
    }
  }

  // ─── PUT: atualiza e-book existente (via query string ?id=X) ───
  if (req.method === 'PUT') {
    const client = await pool.connect();
    try {
      const ebookId = parseInt(req.query.id);
      const { titulo, autor, descricao, imagem_url, ativo, links } = req.body;

      await client.query('BEGIN');

      await client.query(
        `UPDATE ebooks SET titulo=$1, autor=$2, descricao=$3, imagem_url=$4, ativo=$5 WHERE id=$6`,
        [titulo, autor || null, descricao || null, imagem_url || null, !!ativo, ebookId]
      );

      if (Array.isArray(links)) {
        await client.query('DELETE FROM links_compra WHERE ebook_id = $1', [ebookId]);
        for (const link of links) {
          if (link.plataforma && link.url) {
            await client.query(
              `INSERT INTO links_compra (ebook_id, plataforma, url) VALUES ($1,$2,$3)`,
              [ebookId, link.plataforma.trim(), link.url.trim()]
            );
          }
        }
      }

      await client.query('COMMIT');
      return res.json({ ok: true });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('PUT /api/admin/ebooks →', err.message);
      return res.status(500).json({ erro: 'Erro interno.' });
    } finally {
      client.release();
    }
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}

module.exports = requireAuth(handler);
