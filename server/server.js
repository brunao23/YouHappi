require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json({ extended: false }));

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas da API
app.use('/api/users', userRoutes);

// Serve os arquivos estáticos do React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    if (req.url.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Tratamento de erros mais robusto
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(err.status || 500).json({ 
    error: 'Erro interno do servidor', 
    message: process.env.NODE_ENV === 'production' ? 'Algo deu errado' : err.message 
  });
});

// Função para iniciar o servidor
const startServer = async () => {
  try {
    await connectDB();
    console.log('Conexão com o MongoDB estabelecida');

    const PORT = process.env.PORT || 5000;
    
    // Apenas inicie o servidor se não estivermos em um ambiente serverless
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    } else {
      console.log('Servidor pronto para ambiente serverless');
    }
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error.message);
    // Em um ambiente de produção, você pode querer implementar uma lógica de retry aqui
  }
};

// Iniciar o servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = app;
