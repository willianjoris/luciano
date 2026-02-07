const { getPool } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido.' });

  try {
    const pool = getPool();
    const { rows: ebooks } = await pool.query(
      `SELECT id, titulo, autor, descricao, imagem_url
       FROM ebooks
       WHERE ativo = true
       ORDER BY criado_em DESC`
    );

    const result = await Promise.all(
      ebooks.map(async (eb) => {
        const { rows: links } = await pool.query(
          `SELECT id, plataforma, url FROM links_compra WHERE ebook_id = $1 ORDER BY id`,
          [eb.id]
        );
        return { ...eb, links };
      })
    );

    res.json(result);
  } catch (err) {
    console.error('GET /api/ebooks →', err.message);
    res.status(500).json({ erro: 'Erro interno.' });
  }
};
