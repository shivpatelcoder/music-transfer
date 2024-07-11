const express = require('express');
const axios = require('axios');
const router = express.Router();
const querystring = require('querystring');

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const spotify_client_id = '52a0b98e35e5408a8bb4e4c877109c92';  // Replace with your actual client ID
const redirect_uri = 'http://localhost:5000/auth/callback';  // Make sure this matches registered URI
const spotify_client_secret = '8db4492d0cf141cd8118094787d3a003';



router.get('/login', (req, res) => {
  console.log('Login endpoint hit');
  const scope = 'streaming user-read-email user-read-private';
  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
  });

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});



router.get('/callback', async (req, res) => {
    console.log('Callback endpoint hit')
    const code = req.query.code || null;
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
        client_id: spotify_client_id,
        client_secret: spotify_client_secret,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
  
      const { access_token } = response.data;

      // Redirect to the frontend with the access token
      res.redirect(`http://localhost:3000?access_token=${access_token}`);
    } catch (error) {
      console.error('Error exchanging code for tokens:', error.response.data);
      res.status(500).json({ error: 'Failed to exchange code for tokens' });
    }
  });
  
  module.exports = router;

// router.get('/callback', (req, res) => {
//   const code = req.query.code || null;
//   const state = req.query.state || null;

//   res.send(`Code: ${code}, State: ${state}`);
// });

// module.exports = router;
