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

// Rotas
app.use('/api/users', userRoutes);

// Serve os arquivos estáticos do React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Todas as outras requisições GET não tratadas retornarão nosso app React
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));