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
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    if (req.url.startsWith('/api/')) {
      return res.status(404).send('API endpoint not found');
    }
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Tratamento de erros mais robusto
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!', details: err.message });
});

module.exports = app;
