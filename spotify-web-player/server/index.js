
// basic endpoints to the frontend corresponding to the steps of the authorization flow

const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const port = 5000;
const app = express();
const cors = require('cors');
const querystring = require('querystring');
const authRouter = require('./routes/auth');

app.use(cors());
app.use('/auth', authRouter);

// dotenv.config()

// const spotify_client_id = '52a0b98e35e5408a8bb4e4c877109c92';
// const spotify_client_secret = '8db4492d0cf141cd8118094787d3a003';
// const redirect_uri = 'http://localhost:3000/auth/callback';


router.get('/auth/login', (req, res) => {
});

router.get('/auth/callback', (req, res) => {
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})


// function generateRandomString (length) {
//   let text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };


// //redirection to the Spotify login screen to allow users to grant permissions

// router.get('/auth/login', (req, res) => {
//   console.log('Redirecting to Spotify...');
//   const scope = 'streaming user-read-email user-read-private';
//   const state = generateRandomString(16);

//   const auth_query_parameters = new URLSearchParams({
//     response_type: 'code',
//     client_id: spotify_client_id,
//     scope: scope,
//     redirect_uri: redirect_uri,
//     state: state,
//   });

//   res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());

// });

// router.get('/auth/callback', (req, res) => {
//   const code = req.query.code || null;
//   const state = req.query.state || null;

//   res.send(`Code: ${code}, State: ${state}`);
// });

//  module.exports = router;




//callback endpoint after authorization

// app.get('/auth/callback', (req, res) => {

//   var code = req.query.code;

//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       code: code,
//       redirect_uri: "http://localhost:3000/auth/callback",
//       grant_type: 'authorization_code'
//     },
//     headers: {
//       'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
//       'Content-Type' : 'application/x-www-form-urlencoded'
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.redirect('/')
//     }
//   });
// })


// //return access token 

// //app.get('/auth/token', (req, res) => {
// //  res.json(
// //     {
// //        access_token: access_token
// //     })
// //})
