require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:*', 'https://keypmine.luxumbra.dev'],
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

// This is the first endpoint.
app.post('/storeToken', (req, res) => {
  const token = req.body.token;
  if (!token) {
    res.status(400).json({ error: 'No token provided' });
    return;
  }
  const authCode = generateAuthCode();
  store[authCode] = token;
  res.json({ authCode: authCode });
});

// This is the second endpoint.
app.get('/getToken/:authCode', (req, res) => {
  const authCode = req.params.authCode;
  const token = store[authCode];
  if (!token) {
    res.status(400).json({ error: 'Invalid auth code' });
    return;
  }
  res.json({ token: token });
});

// This starts the server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});