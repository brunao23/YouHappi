// server/index.js

const app = require('./server');

// Handler para a função serverless
module.exports = async (req, res) => {
  // Adiciona um middleware para lidar com o corpo da requisição
  if (req.method === 'POST') {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  }

  // Adiciona um middleware para lidar com query params
  req.query = req.query || {};

  // Adiciona headers necessários
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Lida com requisições OPTIONS (para CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Passa a requisição para o app Express
  return new Promise((resolve) => {
    app(req, res);
    res.on('finish', resolve);
  });
};

// Mantém a capacidade de iniciar o servidor localmente
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
