const app = require('./server');

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

<<<<<<< HEAD
module.exports = app;
=======
module.exports = app;
>>>>>>> 68f91ff39aac3bd8b408b1236fd72c9ddcc12baf
