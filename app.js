require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3420', 'https://keypmine.luxumbra.dev'],
}))

app.use(express.json()); // for parsing application/json

const crypto = require('crypto');

// This is the in-memory store for this example.
// In production, use a real database or cache system like Redis.
const store = {};

// This generates a random alphanumeric string of length 6.
function generateAuthCode() {require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3420', 'https://keypmine.luxumbra.dev'],
}))

app.use(express.json()); // for parsing application/json

const crypto = require('crypto');

// This is the in-memory store for this example.
// In production, use a real database or cache system like Redis.
const store = {};

// This generates a random alphanumeric string of length 6.
function generateAuthCode() {
  return crypto.randomBytes(3).toString('hex');
}

/**
 * This is the first endpoint.
 * The frontend will call this endpoint once authenticated with keyp
 * to obtain the auth code to then pass to the minetest server to
 * finalise the authentication process.
 */
app.post('/storeInfo', (req, res) => {
  console.log('/storeInfo req', store);
  const ACCESS_TOKEN = req.body.token;
  const data = {
    accessToken: ACCESS_TOKEN,
  }

  const authCode = generateAuthCode();
  store[authCode] = data;

  res.json({ authCode: authCode });
});

/**
 * This is the second endpoint.
 * The minetest server will call this endpoint with the auth code
 */
app.get('/getInfo/:authCode', async (req, res) => {
  try {
    console.log('/getInfo', { params: req.params , body: req.body,  store });
    const authCode = req.params.authCode;
    const token = store[authCode].accessToken;

    const userDetails = await fetch('https://api.usekeyp.com/oauth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.status != 200) throw 'KEYP authorization failed, or secret invalid'
      return res.json({})
    })

    if (!token) {
      res.status(400).json({ error: 'Invalid auth code' });

      return;
    }
    res.json({
      accessToken: token,
      walletAddress: userDetails.address,
    });

  } catch (error) {
    console.log('getInfo/authCode error', error.message)
    res.status(400).json({ error: error.message });
  }
});

// This starts the server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
  return crypto.randomBytes(3).toString('hex');
}

// This is the first endpoint.
app.post('/storeToken', (req, res) => {
  console.log('/storeToken req', req.body);
  const token = req.body.token;
  if (!token) {
    res.status(400).json({ error: 'No token provided' });
    return;
  }
  const authCode = generateAuthCode();
  const address = req.body.address;
  store[authCode] = token;
  res.json({ authCode: authCode, walletAddress: address });
});

// This is the second endpoint.
app.get('/getToken/:authCode', (req, res) => {
  console.log('/getToken', req.params, req.body);
  const authCode = req.params.authCode;
  const address = req.params.address;
  const token = store[authCode];
  if (!token) {
    res.status(400).json({ error: 'Invalid auth code' });
    return;
  }
  res.json({ token: token, address: address });
});

// This starts the server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});