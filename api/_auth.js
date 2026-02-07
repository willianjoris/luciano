const jwt = require('jsonwebtoken');

function requireAuth(handler) {
  return async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const header = req.headers.authorization || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = payload;
      return handler(req, res);
    } catch (_) {
      return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
  };
}

module.exports = { requireAuth };
