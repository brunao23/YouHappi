const app = require('./server');

// Inicie o servidor apenas se não estiver no ambiente Vercel
if (process.env.VERCEL_ENV === undefined) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

// Exporte o app para uso com serverless functions
module.exports = app;
