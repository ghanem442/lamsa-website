const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const env = require('./config/env');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy setting (for rate limiting behind proxies/load balancers)
// When hosting behind nginx, cloudflare, or any reverse proxy, this ensures
// each customer gets their own rate limit based on their real IP, not the proxy IP
const trustProxy = process.env.TRUST_PROXY || 'loopback';
app.set('trust proxy', trustProxy);

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://accounts.google.com", "https://apis.google.com"],
      scriptSrcAttr: ["'unsafe-hashes'", "'unsafe-inline'"], // Allow inline event handlers (onclick, etc.)
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https:"],
      connectSrc: ["'self'", "https://api.cloudinary.com", "https://accounts.google.com", "https://apis.google.com"],
      frameSrc: ["https://accounts.google.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes under /api
app.use('/api', apiRoutes);

// Serve frontend static files
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));

// --------------------------------------------------
// CLEAN URL ROUTES (without .html extension)
// --------------------------------------------------

// Root route - show intro page
app.get('/', (req, res) => res.sendFile(path.join(rootDir, 'intro.html')));

// Main pages with clean URLs
app.get('/home', (req, res) => res.sendFile(path.join(rootDir, 'index.html')));
app.get('/shop', (req, res) => res.sendFile(path.join(rootDir, 'shop.html')));
app.get('/about', (req, res) => res.sendFile(path.join(rootDir, 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(rootDir, 'contact.html')));
app.get('/auth', (req, res) => res.sendFile(path.join(rootDir, 'auth.html')));
app.get('/account', (req, res) => res.sendFile(path.join(rootDir, 'account.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(rootDir, 'admin.html')));

// Service pages with descriptive names
app.get('/perfume-studio', (req, res) => res.sendFile(path.join(rootDir, 'perfume.html')));
app.get('/routine-finder', (req, res) => res.sendFile(path.join(rootDir, 'routine.html')));
app.get('/gift-designer', (req, res) => res.sendFile(path.join(rootDir, 'gift.html')));

// --------------------------------------------------
// 301 REDIRECTS - Old .html URLs to Clean URLs
// --------------------------------------------------

app.get('/intro.html', (req, res) => res.redirect(301, '/'));
app.get('/index.html', (req, res) => res.redirect(301, '/home'));
app.get('/index', (req, res) => res.redirect(301, '/home'));
app.get('/shop.html', (req, res) => res.redirect(301, '/shop'));
app.get('/about.html', (req, res) => res.redirect(301, '/about'));
app.get('/contact.html', (req, res) => res.redirect(301, '/contact'));
app.get('/auth.html', (req, res) => res.redirect(301, '/auth'));
app.get('/account.html', (req, res) => res.redirect(301, '/account'));
app.get('/admin.html', (req, res) => res.redirect(301, '/admin'));
app.get('/perfume.html', (req, res) => res.redirect(301, '/perfume-studio'));
app.get('/perfume', (req, res) => res.redirect(301, '/perfume-studio'));
app.get('/routine.html', (req, res) => res.redirect(301, '/routine-finder'));
app.get('/routine', (req, res) => res.redirect(301, '/routine-finder'));
app.get('/gift.html', (req, res) => res.redirect(301, '/gift-designer'));
app.get('/gift', (req, res) => res.redirect(301, '/gift-designer'));

// SEO: robots.txt
app.get('/robots.txt', (req, res) => {
  const siteUrl = env.SITE_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send(`# robots.txt for LAMSA Store
User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /account
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`);
});

// SEO: sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const siteUrl = env.SITE_URL || `${req.protocol}://${req.get('host')}`;
  const now = new Date().toISOString().split('T')[0];
  
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/home', priority: '1.0', changefreq: 'daily' },
    { loc: '/shop', priority: '0.9', changefreq: 'daily' },
    { loc: '/routine-finder', priority: '0.8', changefreq: 'weekly' },
    { loc: '/gift-designer', priority: '0.8', changefreq: 'weekly' },
    { loc: '/perfume-studio', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' }
  ];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${siteUrl}${url.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  res.type('application/xml');
  res.send(xml);
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
