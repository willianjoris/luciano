const { getPool } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  try {
    const { link_compra_id, lead_id } = req.body;

    if (!link_compra_id) {
      return res.status(400).json({ erro: 'link_compra_id é obrigatório.' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || null;

    const pool = getPool();
    
    await pool.query(
      `INSERT INTO cliques (link_compra_id, lead_id, ip_visitante) VALUES ($1, $2, $3)`,
      [link_compra_id, lead_id || null, ip]
    );

    await pool.query(
      `UPDATE links_compra SET total_cliques = total_cliques + 1 WHERE id = $1`,
      [link_compra_id]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('POST /api/cliques →', err.message);
    res.status(500).json({ erro: 'Erro interno.' });
  }
};
