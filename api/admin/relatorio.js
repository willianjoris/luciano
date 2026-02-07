const { getPool } = require('../_db');
const { requireAuth } = require('../_auth');

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido.' });

  try {
    const inicio = req.query.inicio || '2020-01-01';
    const fim    = req.query.fim    || new Date().toISOString().split('T')[0];

    const pool = getPool();

    // ── Seção 1: Leads no período ──
    const { rows: leads } = await pool.query(
      `SELECT nome, email, aceita_newsletter,
              to_char(criado_em AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') AS data_hora
       FROM leads
       WHERE criado_em >= $1::date AND criado_em < ($2::date + INTERVAL '1 day')
       ORDER BY criado_em DESC`,
      [inicio, fim]
    );

    // ── Seção 2: Cliques por livro no período ──
    const { rows: cliques } = await pool.query(
      `SELECT
          e.titulo                                          AS livro,
          lc.plataforma,
          COUNT(c.id)::int                                  AS total_cliques,
          to_char(MIN(c.clicado_em) AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') AS primeiro_clique,
          to_char(MAX(c.clicado_em) AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') AS ultimo_clique
       FROM cliques c
       JOIN links_compra lc ON lc.id = c.link_compra_id
       JOIN ebooks e        ON e.id  = lc.ebook_id
       WHERE c.clicado_em >= $1::date AND c.clicado_em < ($2::date + INTERVAL '1 day')
       GROUP BY e.titulo, lc.plataforma
       ORDER BY total_cliques DESC`,
      [inicio, fim]
    );

    // ── Monta CSV ──
    const escape = (v) => {
      const s = String(v ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const row = (cols) => cols.map(escape).join(',');

    let csv = '';

    csv += row(['RELATÓRIO DE LEADS & CLIQUES', `Período: ${inicio} a ${fim}`]) + '\n\n';

    csv += row(['=== LEADS CAPTURADOS ===']) + '\n';
    csv += row(['Nome', 'E-mail', 'Aceita Newsletter', 'Data/Hora']) + '\n';
    leads.forEach(l => {
      csv += row([l.nome, l.email, l.aceita_newsletter ? 'Sim' : 'Não', l.data_hora]) + '\n';
    });
    if (!leads.length) csv += row(['Nenhum lead no período']) + '\n';

    csv += '\n';

    csv += row(['=== CLIQUES POR LIVRO ===']) + '\n';
    csv += row(['Livro', 'Plataforma', 'Total de Cliques', 'Primeiro Clique', 'Último Clique']) + '\n';
    cliques.forEach(c => {
      csv += row([c.livro, c.plataforma, c.total_cliques, c.primeiro_clique, c.ultimo_clique]) + '\n';
    });
    if (!cliques.length) csv += row(['Nenhum clique no período']) + '\n';

    const nome_arquivo = `relatorio_${inicio}_a_${fim}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${nome_arquivo}"`);
    res.send('\uFEFF' + csv);
  } catch (err) {
    console.error('GET /api/admin/relatorio →', err.message);
    res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = requireAuth(handler);
