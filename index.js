const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000;

// Blacklisted IPs storage
const blacklistedIPs = new Set();

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Tangina mo po kapatid',
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).send('Ddos pa more');
  }
});

// Middleware to check for blacklisted IPs
app.use((req, res, next) => {
  if (blacklistedIPs.has(req.ip)) {
    console.warn(`Blocked request from blacklisted IP: ${req.ip}`);
    return res.status(403).send('ddos pa bleeeeee');
  }
  next();
});

// Apply rate limiter to all requests
app.use(limiter);

// Simple route
app.get('/', (req, res) => {
  res.send('Ddos mo nga pogi');
});

// Route to manually blacklist an IP
app.post('/blacklist/:ip', (req, res) => {
  const { ip } = req.params;
  blacklistedIPs.add(ip);
  console.info(`IP ${ip} blacklisted.`);
  res.send(`ampogi ko talaga`);
});

// Route to view blacklisted IPs
app.get('/blacklisted', (req, res) => {
  res.json(Array.from(blacklistedIPs));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
