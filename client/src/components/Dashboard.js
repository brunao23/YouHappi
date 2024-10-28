import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [gratitudeEntry, setGratitudeEntry] = useState('');
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [content, setContent] = useState({ youtube: [], ebooks: [], podcasts: [] });
  const [activeTab, setActiveTab] = useState('gratitude');
  const [motivationMessage, setMotivationMessage] = useState('');
  const [positiveNews, setPositiveNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchGratitudeEntries();
    fetchContent();
    fetchDailyMotivation();
    fetchPositiveNews();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get('/api/users/me', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      navigate('/login');
    }
  };

  const fetchGratitudeEntries = async () => {
    try {
      const res = await axios.get('/api/users/gratitude', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setGratitudeEntries(res.data);
    } catch (err) {
      console.error('Erro ao buscar entradas de gratidão:', err);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await axios.get('/api/users/content', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setContent(res.data);
    } catch (err) {
      console.error('Erro ao buscar conteúdo:', err);
    }
  };

  const fetchDailyMotivation = async () => {
    try {
      const res = await axios.get('/api/users/motivation', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setMotivationMessage(res.data.message);
    } catch (err) {
      console.error('Erro ao buscar mensagem motivacional:', err);
    }
  };

  const fetchPositiveNews = async () => {
    // Simulating API call with static data
    const mockNews = [
      { id: 1, title: "Cientistas descobrem nova espécie de árvore que absorve CO2 em taxa recorde", url: "#" },
      { id: 2, title: "Comunidade se une para limpar praia local, removendo toneladas de lixo", url: "#" },
      { id: 3, title: "Novo programa de educação aumenta taxa de alfabetização em 50%", url: "#" },
      { id: 4, title: "Avanço na tecnologia solar torna energia renovável mais acessível", url: "#" },
      { id: 5, title: "Voluntários plantam 1 milhão de árvores em área desmatada", url: "#" },
    ];
    setPositiveNews(mockNews);
  };

  const handleGratitudeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/gratitude', { content: gratitudeEntry }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setGratitudeEntry('');
      fetchGratitudeEntries();
    } catch (err) {
      console.error('Erro ao salvar entrada de gratidão:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="loading">Carregando...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-background"></div>
      <header className="top-bar">
        <h1 className="neon-text">YouHappi</h1>
        <div className="user-info">
          <span className="user-name">Olá, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="sidebar">
          {['gratitude', 'youtube', 'ebooks', 'podcasts'].map((tab) => (
            <button
              key={tab}
              className={`nav-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <main className="main-content">
          <div className="motivation-banner">
            <p className="neon-text">{motivationMessage}</p>
          </div>

          <div className="content-wrapper">
            <section className="primary-content glass-panel">
              {activeTab === 'gratitude' && (
                <div className="gratitude-journal">
                  <h2 className="section-title">Diário de Gratidão</h2>
                  <form onSubmit={handleGratitudeSubmit}>
                    <textarea
                      value={gratitudeEntry}
                      onChange={(e) => setGratitudeEntry(e.target.value)}
                      placeholder="Do que você é grato hoje?"
                      className="glass-input"
                    />
                    <button type="submit" className="submit-btn">Salvar</button>
                  </form>
                  <div className="gratitude-entries">
                    <h3>Entradas Recentes</h3>
                    {gratitudeEntries.map((entry, index) => (
                      <div key={index} className="gratitude-entry glass-panel">
                        <p>{entry.content}</p>
                        <small>{new Date(entry.date).toLocaleDateString()}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {['youtube', 'ebooks', 'podcasts'].includes(activeTab) && (
                <div className={`content-section ${activeTab}`}>
                  <h2 className="section-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Recomendados</h2>
                  <ul className="content-list">
                    {content[activeTab].map((item, index) => (
                      <li key={index} className="content-item glass-panel">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="neon-link">{item.title}</a>
                        ) : (
                          <strong>{item.title}</strong>
                        )}
                        <p>{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <aside className="news-column glass-panel">
              <h2 className="section-title">Notícias Positivas</h2>
              <ul className="news-list">
                {positiveNews.map((news) => (
                  <li key={news.id} className="news-item">
                    <a href={news.url} target="_blank" rel="noopener noreferrer" className="neon-link">{news.title}</a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;