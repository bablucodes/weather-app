const API_URL = '/api/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const searchCard = document.getElementById('searchCard');
const resultCard = document.getElementById('resultCard');
const refreshBtn = document.getElementById('refreshBtn');
const toggleUnitBtn = document.getElementById('toggleUnitBtn');
const backButton = document.querySelector('.back-icon');

const state = {
    query: '',
    unit: 'c',
    weather: null
};

function formatTemperature(value, unit = state.unit) {
    const converted = unit === 'f' ? (value * 9) / 5 + 32 : value;
    return `${Math.round(converted)}°${unit.toUpperCase()}`;
}

function setBodyTheme(conditionText = '') {
    const text = conditionText.toLowerCase();

    if (text.includes('clear') || text.includes('sunny')) {
        document.body.classList.remove('cloudy', 'rainy', 'night', 'snowy');
        document.body.classList.add('sunny');
        return;
    }

    if (text.includes('mist') || text.includes('fog') || text.includes('cloud') || text.includes('overcast')) {
        document.body.classList.remove('sunny', 'rainy', 'night', 'snowy');
        document.body.classList.add('cloudy');
        return;
    }

    if (text.includes('rain') || text.includes('drizzle') || text.includes('storm') || text.includes('thunder')) {
        document.body.classList.remove('sunny', 'cloudy', 'night', 'snowy');
        document.body.classList.add('rainy');
        return;
    }

    if (text.includes('snow') || text.includes('ice')) {
        document.body.classList.remove('sunny', 'cloudy', 'rainy', 'night');
        document.body.classList.add('snowy');
        return;
    }

    document.body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy');
    document.body.classList.add('night');
}

function renderTemperature() {
    if (!state.weather) {
        return;
    }

    const { current } = state.weather;
    document.getElementById('temp').textContent = formatTemperature(current.temp_c, state.unit);
    document.getElementById('feelsLike').textContent = formatTemperature(current.feelslike_c, state.unit);
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(current.wind_kph)} km/h`;
    document.getElementById('pressure').textContent = `${current.pressure_mb} mb`;
    document.getElementById('visibility').textContent = `${current.vis_km} km`;
    document.getElementById('cloudCover').textContent = `${current.cloud}%`;

    const currentTime = new Date(state.weather.location.localtime.replace(' ', 'T'));
    document.getElementById('localTime').textContent = currentTime.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });

    toggleUnitBtn.textContent = state.unit === 'c' ? '°F / °C' : '°C / °F';
}

function displayWeatherData(data) {
    state.weather = data;
    setBodyTheme(data.current.condition.text);

    document.getElementById('condition').textContent = data.current.condition.text;
    document.getElementById('cityName').textContent = `${data.location.name}, ${data.location.country}`;
    document.getElementById('weatherIcon').src = `https:${data.current.condition.icon}`;
    document.getElementById('weatherBadge').textContent = data.current.is_day ? 'Now' : 'Night';

    renderTemperature();

    searchCard.classList.add('hidden');
    resultCard.classList.remove('hidden');
    cityInput.value = '';
    locationBtn.disabled = false;
    locationBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i><span>Use my location</span>';
}

function setLoadingState(isLoading, buttonName = 'search') {
    const buttons = [searchBtn, locationBtn, refreshBtn];
    buttons.forEach((button) => {
        if (button) {
            button.disabled = isLoading;
            button.style.opacity = isLoading ? '0.75' : '1';
        }
    });

    if (buttonName === 'search') {
        searchBtn.innerHTML = isLoading
            ? '<i class="fa-solid fa-spinner fa-spin"></i>'
            : '<i class="fa-solid fa-search"></i>';
    }

    if (buttonName === 'location') {
        locationBtn.innerHTML = isLoading
            ? '<i class="fa-solid fa-spinner fa-spin"></i><span>Getting location...</span>'
            : '<i class="fa-solid fa-location-crosshairs"></i><span>Use my location</span>';
    }

    if (buttonName === 'refresh') {
        refreshBtn.innerHTML = isLoading
            ? '<i class="fa-solid fa-spinner fa-spin"></i><span>Refreshing...</span>'
            : '<i class="fa-solid fa-rotate-right"></i><span>Refresh</span>';
    }
}

async function getWeatherData(query, options = {}) {
    const { buttonName = 'search' } = options;
    const city = query.trim();

    if (!city) {
        alert('Please enter a city name');
        return;
    }

    if (window.location.protocol === 'file:') {
        alert('Run this app through Vercel to use weather search. See README.md for setup instructions.');
        return;
    }

    setLoadingState(true, buttonName);

    try {
        const response = await fetch(`${API_URL}?query=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Unable to load weather. Try another city.');
        }

        state.query = city;
        displayWeatherData(data);
    } catch (error) {
        alert(error.message || 'Something went wrong. Please try again.');
    } finally {
        setLoadingState(false, buttonName);
    }
}

function getDeviceLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    setLoadingState(true, 'location');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherData(`${lat},${lon}`, { buttonName: 'location' });
        },
        () => {
            alert('Unable to get your location. Please enter a city name manually.');
            setLoadingState(false, 'location');
        }
    );
}

searchBtn.addEventListener('click', () => {
    getWeatherData(cityInput.value, { buttonName: 'search' });
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeatherData(cityInput.value, { buttonName: 'search' });
    }
});

locationBtn.addEventListener('click', getDeviceLocation);

refreshBtn.addEventListener('click', () => {
    if (!state.query) {
        return;
    }

    getWeatherData(state.query, { buttonName: 'refresh' });
});

backButton.addEventListener('click', () => {
    searchCard.classList.remove('hidden');
    resultCard.classList.add('hidden');
    cityInput.value = '';
    cityInput.focus();
});

toggleUnitBtn.addEventListener('click', () => {
    state.unit = state.unit === 'c' ? 'f' : 'c';
    if (state.weather) {
        renderTemperature();
    }
});

window.addEventListener('load', () => {
    cityInput.focus();
    document.body.classList.add('sunny');
});
