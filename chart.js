// When the DOM content is loaded, execute the following code
document.addEventListener('DOMContentLoaded', () => {
  const contactPage = document.getElementById('contactPage');
  const chartsPage = document.getElementById('chartsPage');
  const chartsBtn = document.getElementById('chartsBtn');
  
 // Add an event listener to the charts button

  chartsBtn.addEventListener('click', () => {
   
    renderLineGraph();
    renderMap();
  });

  // Function to render the line graph

  const renderLineGraph = async () => {
    const response = await axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all');
    const graphData = response.data;

    const dates = Object.keys(graphData.cases);
    const cases = Object.values(graphData.cases);

    const lineChart = new Chart(document.getElementById('lineChart'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Cases',
          data: cases,
          borderColor: 'blue',
          fill: false,
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'MM/dd/yyyy',
              unit: 'month',
            },
          },
        },
      }
    });
    
  };
  
    // Function to render the map with markers

  const renderMap = async () => {
    const response = await axios.get('https://disease.sh/v3/covid-19/countries');
    const mapData = response.data;

    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    mapData.forEach(country => {
      const { lat, long, country: countryName, cases, active, recovered, deaths } = country;
      if (lat && long) {
        const popupContent = `
          <div>
            <h3>${countryName}</h3>
            <p>Total Cases: ${cases}</p>
            <p>Active Cases: ${active}</p>
            <p>Recovered: ${recovered}</p>
            <p>Deaths: ${deaths}</p>
          </div>
        `;
        const popup = L.popup().setContent(popupContent);
        L.marker([lat, long]).addTo(map).bindPopup(popup);
      }
    });
  };
});





