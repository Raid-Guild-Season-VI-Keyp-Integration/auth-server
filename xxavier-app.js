// pages/api/auth/[...nextauth].ts
import axios from 'axios';
import { KeypAuth } from "@usekeyp/js-sdk";
import NextAuth from "next-auth";
//import { useSession } from "next-auth/react";

const NextAuthOptions = KeypAuth({
    clientId: process.env.KEYP_CLIENT_ID, // From dev portal
    secret: process.env.KEYP_COOKIE_SECRET, // Random string
    redirectUrl: "http://localhost:3000/api/auth/callback/keyp",
});

export default NextAuth(NextAuthOptions);

//const { data: session } = useSession();

const express = require('express');
const app = express();
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
app.post('/storeInfo', (req, res) => {
  const ACCESS_TOKEN = session.user.accessToken
  const data = {
    accessToken: ACCESS_TOKEN,
  }
  
  const authCode = generateAuthCode();
  store[authCode] = data;
  res.json({ authCode: authCode });
});

// This is the second endpoint.
app.get('/getInfo/:authCode', async (req, res) => {
  const authCode = req.params.authCode;
  const token = store[authCode].accessToken;

  const userDetails = await fetch('https://api.usekeyp.com/oauth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => {
    if (res.status != 200) throw 'KEYP authorization failed, or secret invalid'
    return res.json()
  })
  
  if (!token) {
    res.status(400).json({ error: 'Invalid auth code' });
    return;
  }
  res.json({ 
    accessToken: token,
    walletAddress: userDetails.address, 
  });
});

// This starts the server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});