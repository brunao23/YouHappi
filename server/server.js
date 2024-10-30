require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

console.log('MongoDB URI:', process.env.MONGODB_URI);

// Conectar ao banco de dados
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Rotas da API
app.use('/api/users', userRoutes);

// Serve os arquivos estáticos do React build
if (process.env.NODE_ENV === 'production') {
  // Servir arquivos estáticos
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Manipular rotas do SPA
  app.get('*', (req, res) => {
    // Não servir o app React para rotas da API
    if (req.url.startsWith('/api/')) {
      return res.status(404).send('API endpoint not found');
    }
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Função para iniciar o servidor (útil para desenvolvimento local)
const startServer = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
};

// Iniciar o servidor apenas se não estiver em produção
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// Exportar o app para uso com serverless functions
module.exports = app;