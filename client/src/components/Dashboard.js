// src/components/Dashboard.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [gratitudeEntry, setGratitudeEntry] = useState('');
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [_content, setContent] = useState({ youtube: [], ebooks: [], podcasts: [] });
  const [activeTab, setActiveTab] = useState('gratitude');
  const [motivationMessage, setMotivationMessage] = useState('');
  const [positiveNews, setPositiveNews] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [youtubeCategories] = useState([
    'Motivação', 
    'Desenvolvimento Pessoal', 
    'Meditação', 
    'Produtividade', 
    'Mindfulness', 
    'Autoconhecimento', 
    'Inteligência Emocional'
  ]);
  const [activeYoutubeCategory, setActiveYoutubeCategory] = useState('Motivação');
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [ebookCategories] = useState([
    'Todos',
    'Desenvolvimento Pessoal',
    'Empreendedorismo',
    'Finanças',
    'Liderança',
    'Produtividade'
  ]);
  const [activeEbookCategory, setActiveEbookCategory] = useState('Todos');
  const [podcasts, setPodcasts] = useState([]);
  const [podcastCategories] = useState([
    'Desenvolvimento Pessoal',
    'Motivação',
    'Produtividade',
    'Mindfulness',
    'Empreendedorismo',
    'Liderança'
  ]);
  const [activePodcastCategory, setActivePodcastCategory] = useState('Desenvolvimento Pessoal');
  const [currentPodcast, setCurrentPodcast] = useState(null);

  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const res = await axios.get('/api/users/me', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      navigate('/login');
    }
  }, [navigate]);

  const fetchGratitudeEntries = useCallback(async () => {
    try {
      const res = await axios.get('/api/users/gratitude', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setGratitudeEntries(res.data);
    } catch (err) {
      console.error('Erro ao buscar entradas de gratidão:', err);
    }
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      const res = await axios.get('/api/users/content', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setContent(res.data);
    } catch (err) {
      console.error('Erro ao buscar conteúdo:', err);
    }
  }, []);

  const fetchDailyMotivation = useCallback(async () => {
    try {
      const res = await axios.get('/api/users/motivation', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setMotivationMessage(res.data.message);
    } catch (err) {
      console.error('Erro ao buscar mensagem motivacional:', err);
    }
  }, []);

  const fetchPositiveNews = useCallback(async () => {
    const mockNews = [
      { id: 1, title: "Cientistas descobrem nova espécie de árvore que absorve CO2 em taxa recorde", url: "#" },
      { id: 2, title: "Comunidade se une para limpar praia local, removendo toneladas de lixo", url: "#" },
      { id: 3, title: "Novo programa de educação aumenta taxa de alfabetização em 50%", url: "#" },
      { id: 4, title: "Avanço na tecnologia solar torna energia renovável mais acessível", url: "#" },
      { id: 5, title: "Voluntários plantam 1 milhão de árvores em área desmatada", url: "#" },
    ];
    setPositiveNews(mockNews);
  }, []);

  const fetchYoutubeVideos = useCallback(async (category) => {
    const API_KEY = 'AIzaSyATEjSujclHMHyKxo6aF1xfWxtpmYccleE';
    
    try {
      const res = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${category}&type=video&key=${API_KEY}`);
      
      const videos = res.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        description: item.snippet.description
      }));
      
      setYoutubeVideos(videos);
    } catch (error) {
      console.error('Erro ao buscar vídeos do YouTube:', error);
    }
  }, []);

  const fetchEbooks = useCallback(async (category) => {
    const API_KEY = 'AIzaSyATEjSujclHMHyKxo6aF1xfWxtpmYccleE';
    const query = category === 'Todos' ? 'self-help' : category;
    
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&key=${API_KEY}`);
      
      const books = res.data.items.map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        description: item.volumeInfo.description,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Image',
        previewLink: item.volumeInfo.previewLink,
        buyLink: item.saleInfo.buyLink
      }));
      
      setEbooks(books);
    } catch (error) {
      console.error('Erro ao buscar eBooks:', error);
    }
  }, []);

  const fetchPodcasts = useCallback(async (category) => {
    const CLIENT_ID = '24a9164a27994b3e9afc67f57ea9900a';
    const CLIENT_SECRET = '7f85f128bf45481a8e287e0937beb09a';

    try {
      // Obter token de acesso
      const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Buscar podcasts
      const podcastResponse = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: category,
          type: 'show',
          market: 'BR',
          limit: 20
        },
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });

      setPodcasts(podcastResponse.data.shows.items);
    } catch (error) {
      console.error('Erro ao buscar podcasts:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchGratitudeEntries();
    fetchContent();
    fetchDailyMotivation();
    fetchPositiveNews();
    fetchYoutubeVideos('Motivação');
    fetchEbooks('Todos');
    fetchPodcasts('Desenvolvimento Pessoal');
  }, [fetchUserData, fetchGratitudeEntries, fetchContent, fetchDailyMotivation, fetchPositiveNews, fetchYoutubeVideos, fetchEbooks, fetchPodcasts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => 
        (prevIndex + 1) % positiveNews.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [positiveNews]);

  const handlePodcastCategoryChange = (category) => {
    setActivePodcastCategory(category);
    fetchPodcasts(category);
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

  const handleVideoClick = (video) => {
    setExpandedVideo(video);
  };

  const handleCloseVideo = () => {
    setExpandedVideo(null);
  };

  const handleYoutubeCategoryChange = (category) => {
    setActiveYoutubeCategory(category);
    fetchYoutubeVideos(category);
  };

  const handleEbookCategoryChange = (category) => {
    setActiveEbookCategory(category);
    fetchEbooks(category);
  };

  const handlePodcastPlay = (podcast) => {
    setCurrentPodcast(podcast);
  };

  const handlePodcastStop = () => {
    setCurrentPodcast(null);
  };

  if (!user) return <div className="loading">Carregando...</div>;

  return (
    <div className="dashboard">
      <header className="top-bar">
        <h1 className="app-title-dashboard">YouHappi</h1>
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
            <p>{motivationMessage}</p>
          </div>

          <div className="content-wrapper">
            <section className="primary-content">
              {activeTab === 'gratitude' && (
                <div className="gratitude-journal">
                  <h2>Diário de Gratidão</h2>
                  <form onSubmit={handleGratitudeSubmit}>
                    <textarea
                      value={gratitudeEntry}
                      onChange={(e) => setGratitudeEntry(e.target.value)}
                      placeholder="Do que você é grato hoje?"
                    />
                    <button type="submit">Salvar</button>
                  </form>
                  <div className="gratitude-entries">
                    <h3>Entradas Recentes</h3>
                    {gratitudeEntries.map((entry, index) => (
                      <div key={index} className="gratitude-entry">
                        <p>{entry.content}</p>
                        <small>{new Date(entry.date).toLocaleDateString()}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'youtube' && (
                <div className="youtube-content">
                  <div className="youtube-categories">
                    {youtubeCategories.map((category) => (
                      <button
                        key={category}
                        className={`category-button ${activeYoutubeCategory === category ? 'active' : ''}`}
                        onClick={() => handleYoutubeCategoryChange(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className="youtube-grid">
                    {youtubeVideos.map((video) => (
                      <div key={video.id} className="youtube-video" onClick={() => handleVideoClick(video)}>
                        <div className="video-thumbnail">
                          <img src={video.thumbnail} alt={video.title} />
                        </div>
                        <div className="video-info">
                          <h3>{video.title}</h3>
                          <p>{video.channelTitle}</p>
                          <p>{video.publishedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {expandedVideo && (
                    <div className="expanded-video-overlay" onClick={handleCloseVideo}>
                      <div className="expanded-video-container" onClick={(e) => e.stopPropagation()}>
                        <iframe
                          width="560"
                          height="315"
                          src={`https://www.youtube.com/embed/${expandedVideo.id}`}
                          title={expandedVideo.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        <button className="close-video-btn" onClick={handleCloseVideo}>Fechar</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ebooks' && (
                <div className="ebooks-content">
                  <h2>Biblioteca de eBooks</h2>
                  <div className="ebook-categories">
                    {ebookCategories.map((category) => (
                      <button
                        key={category}
                        className={`category-button ${activeEbookCategory === category ? 'active' : ''}`}
                        onClick={() => handleEbookCategoryChange(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className="ebooks-grid">
                    {ebooks.map((ebook) => (
                      <div key={ebook.id} className="ebook-item">
                                                <img src={ebook.thumbnail} alt={ebook.title} className="ebook-cover" />
                        <div className="ebook-info">
                          <h3>{ebook.title}</h3>
                          <p>{ebook.authors?.join(', ')}</p>
                          <a href={ebook.previewLink} target="_blank" rel="noopener noreferrer" className="preview-btn">Visualizar</a>
                          {ebook.buyLink && (
                            <a href={ebook.buyLink} target="_blank" rel="noopener noreferrer" className="buy-btn">Comprar</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'podcasts' && (
                <div className="podcasts-content">
                  <h2>Podcasts Recomendados</h2>
                  <div className="podcast-categories">
                    {podcastCategories.map((category) => (
                      <button
                        key={category}
                        className={`category-button ${activePodcastCategory === category ? 'active' : ''}`}
                        onClick={() => handlePodcastCategoryChange(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className="podcasts-grid">
                    {podcasts.map((podcast) => (
                      <div key={podcast.id} className="podcast-card">
                        <img src={podcast.images[1].url} alt={podcast.name} />
                        <div className="podcast-info">
                          <h3>{podcast.name}</h3>
                          <p>{podcast.publisher}</p>
                          <button onClick={() => handlePodcastPlay(podcast)} className="listen-btn">
                            Ouvir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <aside className="news-column">
              <h2>Notícias Positivas</h2>
              <div className="news-slider">
                {positiveNews.map((news, index) => (
                  <div 
                    key={news.id} 
                    className={`news-item ${index === currentNewsIndex ? 'active' : ''}`}
                  >
                    <a href={news.url} target="_blank" rel="noopener noreferrer">{news.title}</a>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </main>
      </div>

      {currentPodcast && (
        <div className="podcast-player">
          <h3>{currentPodcast.name}</h3>
          <iframe
            title={`Spotify Podcast - ${currentPodcast.name}`}
            src={`https://open.spotify.com/embed/show/${currentPodcast.id}`}
            width="100%"
            height="232"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
          <button onClick={handlePodcastStop} className="stop-btn">
            Parar
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
