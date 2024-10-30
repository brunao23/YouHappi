const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('A variável de ambiente MONGODB_URI não está definida');
    }

    console.log('Tentando conectar ao MongoDB...');
    console.log('URI:', process.env.MONGODB_URI.replace(/\/\/(.*)@/, '//****:****@')); // Oculta as credenciais no log
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    
    console.log('MongoDB Conectado com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    
    // Adiciona mais informações de diagnóstico
    if (err.name === 'MongooseServerSelectionError') {
      console.error('Não foi possível conectar a nenhum servidor no seu cluster MongoDB Atlas.');
      console.error('Possíveis razões:');
      console.error('1. O endereço IP do servidor não está na lista de IPs permitidos no MongoDB Atlas.');
      console.error('2. As credenciais na string de conexão estão incorretas.');
      console.error('3. Problemas de rede ou firewall estão bloqueando a conexão.');
    }

    // Não encerra o processo aqui, apenas registra o erro
    // process.exit(1);
  }
};

module.exports = connectDB;
