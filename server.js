const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files from root directory
app.use(express.static(path.join(__dirname)));

// Root route: Start from intro page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'intro.html'));
});

// Direct access to all main pages
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/shop', (req, res) => res.sendFile(path.join(__dirname, 'shop.html')));
app.get('/auth', (req, res) => res.sendFile(path.join(__dirname, 'auth.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ LAMSA Store is running live on port ${PORT}`);
});
