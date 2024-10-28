require('dotenv').config();
const express = require('express');
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));