const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const GratitudeEntry = require('../models/GratitudeEntry');
const Content = require('../models/Content');

// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(senha, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Nova rota para obter dados do usuário
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota de registro (se ainda não existir, adicione-a)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para salvar uma entrada de gratidão
router.post('/gratitude', auth, async (req, res) => {
  try {
    const newEntry = new GratitudeEntry({
      user: req.user.id,
      content: req.body.content
    });
    await newEntry.save();
    res.json(newEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para obter entradas de gratidão do usuário
router.get('/gratitude', auth, async (req, res) => {
  try {
    const entries = await GratitudeEntry.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para obter conteúdo recomendado
router.get('/content', auth, async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para obter mensagem motivacional
router.get('/motivation', auth, async (req, res) => {
  const motivations = [
    "Cada dia é uma nova oportunidade para ser melhor!",
    "Acredite em você mesmo e tudo será possível.",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Sua única limitação é você mesmo.",
    "O otimismo é a fé que leva à realização. Nada pode ser feito sem esperança e confiança."
  ];
  const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
  res.json({ message: randomMotivation });
});

module.exports = router;