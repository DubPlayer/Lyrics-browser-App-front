import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGithub } from 'react-icons/fa';

function App() {
  // Estados
  const [song, setSong] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [error, setError] = useState('');
  const [cover, setCover] = useState('');
  const [artist, setArtist] = useState('');
  const [songname, setSongName] = useState('');
  const [ReleaseDate, setReleaseDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);
    

  // Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSearching(true);
    const customSearchUrl = 'https://test-beta-seven-33.vercel.app/api/genius/lyrics?q=';
    try {
      const data = await searchSongsWithUrl(customSearchUrl, song);
      console.log('Data:', data);
      setLyrics(data.lyrics);
      setEmbedUrl(data.EmbedUrl); 
      setCover(data.imageUrl);
      setArtist(data.artist);
      setSongName(data.title);
      setReleaseDate(data.releaseDate);
      
    
      setError(''); 

      // Enviar notificación con la información de la búsqueda
      const notificationUrl = 'https://test-beta-seven-33.vercel.app/genius/notify';
      const now = new Date();
      const formattedTimestamp = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      const notificationData = {
        song: song,
        timestamp: formattedTimestamp,
        notificationTime: formattedTimestamp,
        notificationmessage: data.youtubeMessage
        
      };
        // Enviar la notificación después de 2 segundos
        setTimeout(async () => {
          try {
            await axios.post(notificationUrl, notificationData);
            console.log('Notification sent successfully');
          } catch (error) {
            console.error('Error sending notification:', error);
          }
        }, 2000);
      

    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Error de respuesta del servidor:', error.response.data);
        setError('Error en la respuesta del servidor.');
      } else if (error.request) {
        console.error('Error de solicitud:', error.request);
        setError('No se recibió respuesta del servidor.');
      } else {
        console.error('Error al configurar la solicitud:', error.message);
        setError('Error al configurar la solicitud.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (embedUrl) {
      console.log('Embed URL:', embedUrl);
    }
  }, [embedUrl]);

  async function searchSongsWithUrl(baseUrl, song) {
    try {
      const response = await axios.get(`${baseUrl}${song}`);
      const songData = response.data;
      return songData;
    } catch (error) {
      console.error('Error al buscar la canción:', error);
      throw error;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Song Lyrics</h1>

       <form onSubmit={handleSubmit} className="search-form">
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Enter song name and artist" 
          value={song} 
          onChange={(e) => setSong(e.target.value)} 
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </div>
    </form>
        
        {isSearching && <p>Searching...</p>}

        {error && <p className="error-message">{error}</p>}

         
              
        {lyrics && (
          <div className="lyrics-container">
            {cover && songname && artist && ReleaseDate && (
            <div className="song-info">
              <img src={cover} alt={`${songname} cover`} className="cover-image" />
              <h2>{songname}</h2>
              <h3>{artist}</h3>
              <p>Release Date: {ReleaseDate}</p>
            </div>
          )}
                {embedUrl && (
                <div className="video-container">
                  <iframe 
                    width="560" 
                    height="315" 
                    src={embedUrl} 
                    title="Video de la canción" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    onError={() => setError('Failed to load video.')}
                  ></iframe>
                </div>
              )}
            <h2>Lyrics:</h2>
            <pre>{lyrics}</pre>

          </div>
        )}
        
      </header>
      <footer className="footer-icons">
        <a href="https://github.com/DubPlayer" target="_blank" rel="noopener noreferrer">
          <FaGithub size={35} />
        </a>
      </footer>
    </div>
  );
}

export default App;