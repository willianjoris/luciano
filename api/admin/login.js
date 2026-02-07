const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido.' });

  const { usuario, senha } = req.body;

  if (usuario !== process.env.ADMIN_USER || senha !== process.env.ADMIN_PASS) {
    return res.status(401).json({ erro: 'Login ou senha inválidos.' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '4h' });
  res.json({ token });
};
