const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

// Middleware: JSON- ja lomakedatan käsittely
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Oletusarvot
let sensorData = { temperature: null, humidity: null };

// API: Hae sensori-data
app.get('/api/data', (req, res) => {
  res.json(sensorData); // Palautetaan Arduinon lähettämä data frontille
});

// API: Vastaanota sensori-data Arduinolta
app.post('/api/data', (req, res) => {
  const { temperature, humidity } = req.body;
  if (temperature !== undefined && humidity !== undefined) {
    sensorData = { temperature, humidity }; // Päivitetään tallennettu sensori-data
    console.log(`Received sensor data: Temp=${temperature}, Humidity=${humidity}`);
    res.send('Sensor data received');
  } else {
    res.status(400).send('Invalid data');
  }
});

// API: Hae asetukset (dashboardilta Arduinolle)
app.get('/api/settings', (req, res) => {
  try {
    const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    res.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).send('Failed to read settings');
  }
});

// API: Päivitä asetukset (dashboardilta)
app.post('/api/settings', (req, res) => {
  const { min, max } = req.body;
  if (min !== undefined && max !== undefined) {
    try {
      fs.writeFileSync('settings.json', JSON.stringify({ min, max }));
      console.log(`Settings updated: Min=${min}, Max=${max}`);
      res.send('Settings updated');
    } catch (error) {
      console.error('Error writing settings:', error);
      res.status(500).send('Failed to update settings');
    }
  } else {
    res.status(400).send('Invalid settings');
  }
});

// Käynnistä palvelin
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
