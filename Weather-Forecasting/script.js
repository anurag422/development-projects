const el = id => document.getElementById(id);
const status = el('status');
const API = {
  geocode: (q) => `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`,
  forecast: (lat, lon) => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
};

const weatherMap = {
  0: ['☀️', 'Clear'], 1: ['🌤️', 'Mainly clear'], 2: ['⛅', 'Partly cloudy'], 3: ['☁️', 'Overcast'],
  45: ['🌫️', 'Fog'], 48: ['🌫️', 'Depositing rime fog'],
  51: ['🌦️', 'Light drizzle'], 53: ['🌦️', 'Moderate drizzle'], 55: ['🌧️', 'Dense drizzle'],
  61: ['🌧️', 'Slight rain'], 63: ['🌧️', 'Moderate rain'], 65: ['⛈️', 'Heavy rain'],
  71: ['🌨️', 'Light snow'], 73: ['🌨️', 'Moderate snow'], 75: ['❄️', 'Heavy snow'],
  95: ['⛈️', 'Thunderstorm'], 96: ['⛈️', 'Thunderstorm with hail'], 99: ['⛈️', 'Severe thunderstorm with hail']

};

const wc = (code) => weatherMap[code] || ['❓', 'Unknown'];

function setstatus(msg, isError = false) {
  status.textContent = msg;
  status.style.color = isError ? '#fca5a5' : 'var(--muted)';
}

function showCurrent(place, cur) {
  el('current').hidden = false;
  el('curPlace').textContent = place;
  const [icon, desc] = wc(cur.weathercode);
  el('curIcon').textContent = icon;
  el('curDesc').textContent = `${desc}  • Wind ${cur.windspeed} m/s`;
  el('curTemp').textContent = Math.round(cur.temperature) + '°C';
  el('curFeels').textContent = `Wind dir ${cur.winddirection}°`;
  el('curTime').textContent = `As of: ${new Date().toLocaleString()}`;
}


function showForecast(daily) {
  const grid = el('forecastGrid');
  grid.innerHTML = '';
  const dates = daily.time || [];
  for (let i = 0; i < dates.length; i++) {
    const d = dates[i];
    const tmax = Math.round(daily.temperature_2m_max[i]);
    const tmin = Math.round(daily.temperature_2m_min[i]);
    const code = daily.weathercode[i];
    const [icon, desc] = wc(code);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div style="font-size:28px">${icon}</div>
                          <h3>${new Date(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</h3>
                          <p>${desc}</p>
                          <p style="margin-top:8px; font-weight:700">${tmax}° / ${tmin}°</p>`;
    grid.appendChild(card);
  }
}


function showDetails(lat, lon, extra) {
  el('latlon').textContent = `${lat.toFixed(4)} , ${lon.toFixed(4)}`;
  if (extra && extra.current_weather) {
    el('wind').textContent = `${extra.current_weather.windspeed} m/s`;
    el('humidity').textContent = '—';
    el('pressure').textContent = '—';
  }
}

async function searchCity(q) {
  setstatus('Searching location.');
  try {
    const gResp = await fetch(API.geocode(q));
    if (!gResp.ok) throw new Error('Geocoding failed');
    const gData = await gResp.json();
    if (!gData.results || gData.results.length === 0) {
      setstatus('Location not found - try another name.', true);
      return;
    }
    const place = gData.results[0];
    const lat = place.latitude, lon = place.longitude;
    setstatus(`Found: ${place.name}, ${place.country} - fetching weather..`);
    const fResp = await fetch(API.forecast(lat, lon));
    if (!fResp.ok) throw new Error('Forecast fetch failed');
    const fData = await fResp.json();
    setstatus('');
    const placeLabel = `${place.name} ${place.admin1 ? ',' + place.admin1 : ''},${place.country}`;
    showCurrent(placeLabel, fData.current_weather || { temperature: '—', windspeed: '—', winddirection: '—', weathercode: fData.daily?.weathercode?.[0] ?? 0 });
    if (fData.daily) showForecast(fData.daily);
    showDetails(lat, lon, fData);
  } catch (error) {
    console.error(error);
    setstatus('Error: ' + error.message, true);
  }
}


document.getElementById('searchBtn').addEventListener('click', () => {
  const q = el('cityInput').value.trim();
  if (!q) { setStatus('Please enter a city name.', true); return; }
  searchCity(q);
});
document.getElementById('cityInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); document.getElementById('searchBtn').click(); }
});

window.addEventListener('load', () => { el('cityInput').value = 'UJJAIN'; document.getElementById('searchBtn').click(); });
