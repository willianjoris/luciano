const { getPool } = require('./_db');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  try {
    const { nome, email, aceita_newsletter } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: 'Nome e e-mail são obrigatórios.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ erro: 'E-mail inválido.' });
    }

    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO leads (nome, email, aceita_newsletter)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome, aceita_newsletter = EXCLUDED.aceita_newsletter
       RETURNING id, criado_em`,
      [nome.trim(), email.trim().toLowerCase(), !!aceita_newsletter]
    );

    res.status(201).json({ ok: true, lead_id: rows[0].id });
  } catch (err) {
    console.error('POST /api/leads →', err.message);
    res.status(500).json({ erro: 'Erro interno.' });
  }
};
