// Hakee tiedot palvelimelta ja päivittää ne dashboardille
async function fetchData() {
    try {
        const response = await fetch('/api/settings'); // Käytä oikeaa reittiä
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        document.getElementById('minTemp').innerText = data.min || 'N/A';
        document.getElementById('maxTemp').innerText = data.max || 'N/A';
        document.getElementById('currentTemp').innerText = 'N/A'; // Lisää myöhemmin "currentTemperature"
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Lähettää lomakkeen tiedot taustalla ilman sivun uudelleenlatausta
document.getElementById('settings-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Estää oletustoiminnan (sivun uudelleenlataus)

    // Hae syötteet lomakkeesta
    const min = document.getElementById('min').value;
    const max = document.getElementById('max').value;

    try {
        // Lähetä POST-pyyntö JSON-tiedoilla
        const response = await fetch('/api/settings', {
            method: 'POST', // Käytä POST-metodia
            headers: {
                'Content-Type': 'application/json', // Aseta Content-Type JSON:ksi
            },
            body: JSON.stringify({ min, max }), // Lähetä tiedot JSON-muodossa
        });

        // Tarkista palvelimen vastaus
        if (response.ok) {
            alert('Settings updated successfully!');
            fetchData(); // Päivitä dashboard uusilla tiedoilla
        } else {
            alert('Error updating settings.');
        }
    } catch (error) {
        console.error('Error submitting settings:', error);
    }
});


// Lataa tiedot heti sivun latautuessa
fetchData();
