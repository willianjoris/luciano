const { getPool } = require('../_db');
const { requireAuth } = require('../_auth');

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido.' });

  try {
    const pagina = Math.max(1, parseInt(req.query.pagina) || 1);
    const limite = Math.min(200, parseInt(req.query.limite) || 50);
    const offset = (pagina - 1) * limite;

    const pool = getPool();
    const { rows: leads } = await pool.query(
      `SELECT id, nome, email, aceita_newsletter, criado_em
       FROM leads ORDER BY criado_em DESC LIMIT $1 OFFSET $2`,
      [limite, offset]
    );

    const { rows: countRow } = await pool.query('SELECT COUNT(*)::int AS total FROM leads');

    res.json({ leads, total: countRow[0].total, pagina, limite });
  } catch (err) {
    console.error('GET /api/admin/leads →', err.message);
    res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = requireAuth(handler);
