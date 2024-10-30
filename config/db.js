const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexão com o MongoDB estabelecida');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
  }
};

module.exports = connectDB;
