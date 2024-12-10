const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(express.json());

// Lisää reitti '/'
app.get('/', (req, res) => {
  res.send('Backend toimii!');
});

// API reitit
app.get('/api/settings', (req, res) => {
  const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  const { min, max } = req.body;
  if (!min || !max) {
    return res.status(400).send('Invalid settings');
  }
  fs.writeFileSync('settings.json', JSON.stringify({ min, max }));
  res.send('Settings updated');
});

// Käynnistä palvelin
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
