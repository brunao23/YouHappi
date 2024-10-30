require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas da API
app.use('/api/users', userRoutes);

// Serve os arquivos estáticos do React build
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.url.startsWith('/static/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
  });

  app.use(express.static(path.join(__dirname, '../client/build'), { 
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(err.status || 500).json({ 
    error: 'Erro interno do servidor', 
    message: process.env.NODE_ENV === 'production' ? 'Algo deu errado' : err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Função para iniciar o servidor
const startServer = async () => {
  try {
    await connectDB();
    console.log('Conexão com o MongoDB estabelecida');

    const PORT = process.env.PORT || 5000;
    
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    } else {
      console.log('Servidor pronto para ambiente serverless');
    }
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
