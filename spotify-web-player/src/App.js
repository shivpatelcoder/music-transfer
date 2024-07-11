import React, { useState, useEffect } from 'react';
import SpotifyPlayer from './SpotifyPlayer';
import Login from './login';
import './App.css';

// function App() {

//   const [token, setToken] = useState('');

//   useEffect(() => {

//     async function getToken() {
//       const response = await fetch('/auth/token');
//       const json = await response.json();
//       setToken(json.access_token);
//     }

//     getToken();

//   }, []);

//   return (
//     <>
//         { (token === '') ? <Login/> : <WebPlayback token={token} /> }
//     </>
//   );
// }

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    console.log('URL params:', window.location.search); // Debugging
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      console.log('Access token:', token); // Debugging
      setAccessToken(token);
      localStorage.setItem('spotify_access_token', token);
      window.history.replaceState({}, document.title, '/');
    } else {
      const storedToken = localStorage.getItem('spotify_access_token');
      if (storedToken) {
        console.log('Stored token:', storedToken); // Debugging
        setAccessToken(storedToken);
      }
    }
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Web Player</h1>
        {!accessToken ? (
          <Login />
        ) : (
          <SpotifyPlayer accessToken={accessToken} />
        )}
      </header>
    </div>
  );
};


export default App;
