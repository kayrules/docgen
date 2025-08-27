const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy login routes
app.use('/login', createProxyMiddleware({
  target: 'https://172.30.79.69:8080',
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Forwarded-Host', req.get('host'));
    proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
  }
}));

// Proxy logout routes  
app.use('/logout', createProxyMiddleware({
  target: 'https://172.30.79.69:8080',
  changeOrigin: true,
  secure: false
}));

// Proxy to Superset root which will handle the redirect
app.use('/superset', createProxyMiddleware({
  target: 'https://172.30.79.69:8080',
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Forwarded-Host', req.get('host'));
    proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error occurred');
  }
}));

// Proxy static assets
app.use('/static', createProxyMiddleware({
  target: 'https://172.30.79.69:8080',
  changeOrigin: true,
  secure: false
}));

// Proxy API routes
app.use('/api', createProxyMiddleware({
  target: 'https://172.30.79.69:8080',
  changeOrigin: true,
  secure: false
}));

// Proxy n8n webhook for chat
app.use('/webhook', createProxyMiddleware({
  target: 'https://nodemation.kayrules.com',
  changeOrigin: true,
  secure: true,
  onError: (err, req, res) => {
    console.error('n8n webhook proxy error:', err.message);
    res.status(503).json({ 
      error: 'n8n service unavailable', 
      message: 'Unable to connect to nodemation.kayrules.com' 
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying webhook request to n8n:', req.path);
  }
}));

// Serve local static files last
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Proxying Superset from https://172.30.79.69:8080`);
});