// server.js
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8081;

// Serve static files from the public directory
app.use(express.static('public'));

// SSL certificate options
const options = {
  key: fs.readFileSync('localhost+1-key.pem'),
  cert: fs.readFileSync('localhost+1.pem')
};

// Create HTTPS server
https.createServer(options, app).listen(port, () => {
  console.log(`Server running at https://localhost:${port}/`);
});
