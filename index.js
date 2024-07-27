const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000;

const blacklistedIPs = new Set();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: 'Tangina mo po kapatid',
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).send('Ddos pa more');
  }
});

app.use((req, res, next) => {
  if (blacklistedIPs.has(req.ip)) {
    console.warn(`Blocked request from blacklisted IP: ${req.ip}`);
    return res.status(403).send('ddos pa bleeeeee');
  }
  next();
});

app.use(limiter);

app.get('/', (req, res) => {
  res.send('Ddos mo nga pogi');
});

app.post('/blacklist/:ip', (req, res) => {
  const { ip } = req.params;
  blacklistedIPs.add(ip);
  console.info(`IP ${ip} blacklisted.`);
  res.send(`ampogi ko talaga`);
});

app.get('/blacklisted', (req, res) => {
  res.json(Array.from(blacklistedIPs));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
