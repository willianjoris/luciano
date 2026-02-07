const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL não configurada nas variáveis de ambiente');
    }

    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('supabase') 
        ? { rejectUnauthorized: false } 
        : false,
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    
    pool.on('error', (err) => {
      console.error('Erro inesperado no pool de conexões:', err.message);
    });
  }
  return pool;
}

module.exports = { getPool };