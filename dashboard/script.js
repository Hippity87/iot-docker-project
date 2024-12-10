// Hakee tiedot palvelimelta ja päivittää ne dashboardille
async function fetchData() {
    try {
      // Hae asetukset
      const responseSettings = await fetch('/api/settings');
      const settings = await responseSettings.json();
      document.getElementById('minTemp').innerText = settings.min || 'N/A';
      document.getElementById('maxTemp').innerText = settings.max || 'N/A';
  
      // Hae sensori-data
      const responseData = await fetch('/api/data');
      const data = await responseData.json();
      document.getElementById('sensorTemp').innerText = data.temperature || 'N/A';
      document.getElementById('currentHumidity').innerText = data.humidity || 'N/A';
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Lähettää lomakkeen tiedot taustalla ilman sivun uudelleenlatausta
  document.getElementById('settings-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const min = document.getElementById('min').value;
    const max = document.getElementById('max').value;
  
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ min: parseFloat(min), max: parseFloat(max) }),
      });
  
      if (response.ok) {
        alert('Settings updated successfully!');
        fetchData(); // Päivitä näyttö uusilla tiedoilla
      } else {
        alert('Error updating settings.');
      }
    } catch (error) {
      console.error('Error submitting settings:', error);
    }
  });
  
  // Lataa tiedot heti sivun latautuessa
  fetchData();
  