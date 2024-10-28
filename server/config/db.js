const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Tentando conectar ao MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    
    console.log('MongoDB Conectado com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;