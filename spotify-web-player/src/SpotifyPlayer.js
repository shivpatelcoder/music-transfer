import React, { useState, useEffect } from 'react';


const SpotifyPlayer = ({ accessToken }) => {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const loadSpotifyPlayer = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const initializeSpotifyPlayer = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK Player',
          getOAuthToken: cb => { cb(accessToken); },
          volume: 0.5
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        player.addListener('player_state_changed', state => { console.log(state); });

        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setIsReady(true);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setIsReady(false);
        });

        // Connect to the player!
        player.connect();
        setPlayer(player);
      };
    };

    loadSpotifyPlayer().then(initializeSpotifyPlayer);
  }, [accessToken, volume]);

  const handlePlayPause = () => {
    if (player) {
      player.togglePlay().then(() => {
        setIsPlaying(!isPlaying);
      });
    }
  };

  const handleNextTrack = () => {
    if (player) {
      player.nextTrack().then(() => {
        console.log('Skipped to next track');
      });
    }
  };

  const handlePreviousTrack = () => {
    if (player) {
      player.previousTrack().then(() => {
        console.log('Returned to previous track');
      });
    }
  };
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (player) {
      player.setVolume(newVolume).then(() => {
        console.log('Volume changed to', newVolume);
      });
    }
  };

  return (
    <div>
      <h2>Spotify Player</h2>
      {isReady ? (
        <div>
          <p>Player is ready</p>
          {currentTrack && (
            <div>
              <p>Currently Playing: {currentTrack.name} by {currentTrack.artists[0].name}</p>
            </div>
          )}
          <div>
            <button onClick={handlePreviousTrack}>Previous Track</button>
            <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button onClick={handleNextTrack}>Next Track</button>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      ) : (
        <p>Initializing...</p>
      )}
    </div>
  );
};


//   return (
//     <div>
//       <h2>Spotify Player</h2>
//       {isReady ? <p>Player is ready</p> : <p>Initializing...</p>}
//     </div>
//   );
// };

export default SpotifyPlayer;


const play = ({
    spotify_uri,
    playerInstance: {
      _options: {
        getOAuthToken,
        id
      }
    }
  }) => {
    getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotify_uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      });
    });
  };
  
// const track = {
//     name: "",
//     album: {
//         images: [
//             { url: "" }
//         ]
//     },
//     artists: [
//         { name: "" }
//     ]
// }

// function WebPlayback(props) {

//     const [is_paused, setPaused] = useState(false);
//     const [is_active, setActive] = useState(false);
//     const [player, setPlayer] = useState(undefined);
//     const [current_track, setTrack] = useState(track);

//     useEffect(() => {

//         const script = document.createElement("script");
//         script.src = "https://sdk.scdn.co/spotify-player.js";
//         script.async = true;

//         document.body.appendChild(script);

//         window.onSpotifyWebPlaybackSDKReady = () => {

//             const player = new window.Spotify.Player({
//                 name: 'Web Playback SDK',
//                 getOAuthToken: cb => { cb(props.token); },
//                 volume: 0.5
//             });

//             setPlayer(player);

//             player.addListener('ready', ({ device_id }) => {
//                 console.log('Ready with Device ID', device_id);
//             });

//             player.addListener('not_ready', ({ device_id }) => {
//                 console.log('Device ID has gone offline', device_id);
//             });

//             player.addListener('player_state_changed', ( state => {

//                 if (!state) {
//                     return;
//                 }

//                 setTrack(state.track_window.current_track);
//                 setPaused(state.paused);

//                 player.getCurrentState().then( state => { 
//                     (!state)? setActive(false) : setActive(true) 
//                 });

//             }));

//             player.connect();

//         };
//     }, []);

//     if (!is_active) { 
//         return (
//             <>
//                 <div className="container">
//                     <div className="main-wrapper">
//                         <b> Instance not active. Transfer your playback using your Spotify app </b>
//                     </div>
//                 </div>
//             </>)
//     } else {
//         return (
//             <>
//                 <div className="container">
//                     <div className="main-wrapper">

//                         <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

//                         <div className="now-playing__side">
//                             <div className="now-playing__name">{current_track.name}</div>
//                             <div className="now-playing__artist">{current_track.artists[0].name}</div>

//                             <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
//                                 &lt;&lt;
//                             </button>

//                             <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
//                                 { is_paused ? "PLAY" : "PAUSE" }
//                             </button>

//                             <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
//                                 &gt;&gt;
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         );
//     }
// }

// export default WebPlayback