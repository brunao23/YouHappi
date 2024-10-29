import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { nome, email, senha, confirmarSenha } = formData;
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }
    setErro('');
    setCarregando(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const body = JSON.stringify({ name: nome, email, password: senha });

      const res = await axios.post('/api/users/register', body, config);
      console.log('Registro bem-sucedido:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no registro:', err.response?.data || err.message);
      setErro(err.response?.data?.msg || 'Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="app-container">
      <div className="register-container card">
        <h1 className="app-title">YouHappi</h1>
        <h2 className="app-subtitle">Você mais feliz</h2>
        <h3 className="register-subtitle">Cadastre-se</h3>
        <p>Comece sua jornada para o bem-estar mental</p>
        {erro && <div className="error-message">{erro}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={nome}
              onChange={onChange}
              required
              placeholder="Digite seu nome"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Digite seu e-mail"
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={senha}
              onChange={onChange}
              minLength="6"
              required
              placeholder="Digite sua senha"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={confirmarSenha}
              onChange={onChange}
              minLength="6"
              required
              placeholder="Confirme sua senha"
            />
          </div>
          <button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="login-link">
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;