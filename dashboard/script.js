document.addEventListener('DOMContentLoaded', () => {
    // Hakee tiedot palvelimelta ja päivittää ne dashboardille
    async function fetchData() {
      try {
        // Hae asetukset palvelimelta
        const responseSettings = await fetch('/api/settings');
        const settings = await responseSettings.json();
  
        const minTempEl = document.getElementById('minTemp');
        if (minTempEl) minTempEl.innerText = settings.min || 'N/A';
  
        const maxTempEl = document.getElementById('maxTemp');
        if (maxTempEl) maxTempEl.innerText = settings.max || 'N/A';
  
        // Hae sensoridata palvelimelta
        const responseData = await fetch('/api/data');
        const data = await responseData.json();
  
        const sensorTempEl = document.getElementById('sensorTemp');
        if (sensorTempEl) sensorTempEl.innerText = data.temperature || 'N/A';
  
        const currentHumidityEl = document.getElementById('currentHumidity');
        if (currentHumidityEl) currentHumidityEl.innerText = data.humidity || 'N/A';
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    // Päivittää asetukset palvelimelle
    document.getElementById('settings-form').addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const minInput = document.getElementById('min');
      const maxInput = document.getElementById('max');
  
      // Varmista, että lomakekentät löytyvät
      if (!minInput || !maxInput) {
        console.error('Form inputs not found.');
        return;
      }
  
      const min = parseFloat(minInput.value);
      const max = parseFloat(maxInput.value);
  
      try {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ min, max }),
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
  });
  