document.getElementById('getWeatherBtn').addEventListener('click', async function() {
    const city = document.getElementById('city').value.trim();  // Get the city name from the input field
    if (!city) {  // If the city is not entered, alert the user
        alert('Please enter a city name.');
        return;
    }

    try {
        // Fetch the coordinates (latitude and longitude) of the city
        const coordinatesResponse = await fetch(`/get-coordinates?city=${city}`);
        const coordinatesData = await coordinatesResponse.json();

        if (coordinatesResponse.status !== 200) {  // Handle error if city not found
            alert('City not found. Please try again.');
            return;
        }

        const { latitude, longitude } = coordinatesData;

        // Fetch the weather data based on the coordinates
        const weatherResponse = await fetch(`/get-weather?latitude=${latitude}&longitude=${longitude}`);
        const weatherData = await weatherResponse.json();

        if (weatherResponse.status !== 200) {  // Handle error fetching weather data
            alert('Error fetching weather data.');
            return;
        }

        // Display weather data in the HTML
        const weatherResults = document.getElementById('weatherResults');
        document.getElementById('temperature').textContent = `Temperature: ${weatherData.temperature}°C`;
        document.getElementById('windSpeed').textContent = `Wind Speed: ${weatherData.wind_speed} km/h`;
        document.getElementById('humidity').textContent = `Humidity: ${weatherData.humidity}%`; // Display humidity
        document.getElementById('condition').textContent = `Condition: ${getWeatherDescription(weatherData.weather_code)}`;

        // Set the weather icon dynamically
        const weatherIcon = getWeatherIcon(weatherData.weather_code);
        const iconElement = document.createElement('img');
        iconElement.src = weatherIcon;
        iconElement.alt = 'Weather Icon';
        iconElement.className = 'weather-icon';
        document.getElementById('condition').prepend(iconElement);

        weatherResults.style.display = 'block';  // Show the weather results

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');  // Handle network or other errors
    }
});

// Convert weather code to human-readable description
function getWeatherDescription(weatherCode) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Cloudy',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light rain',
        53: 'Moderate rain',
        55: 'Heavy rain',
        61: 'Showers',
        63: 'Heavy showers',
        71: 'Light snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Showers of rain',
        81: 'Heavy showers of rain',
        82: 'Thunderstorm',
    };

    return descriptions[weatherCode] || 'Unknown condition';
}

// Return weather icon URL based on weather code
function getWeatherIcon(weatherCode) {
    const icons = {
        0: 'https://img.icons8.com/?size=100&id=3XF0thYbeGge&format=png&color=000000',  // Clear sky
        1: 'https://img.icons8.com/?size=100&id=txoP0q0H3NEb&format=png&color=000000',  // Mainly clear
        2: 'https://img.icons8.com/?size=100&id=TquwKm18epOW&format=png&color=000000',  // Partly cloudy
        3: 'https://img.icons8.com/?size=100&id=2897&format=png&color=000000',  // Cloudy
        45: 'https://img.icons8.com/?size=100&id=0jk61BDH9XNt&format=png&color=000000',  // Fog
        48: 'https://img.icons8.com/?size=100&id=5JFKFoWQfT74&format=png&color=000000',  // Rime fog
        51: 'https://img.icons8.com/?size=100&id=9262&format=png&color=000000',  // Light rain
        53: 'https://img.icons8.com/?size=100&id=656&format=png&color=000000',  // Moderate rain
        55: 'https://img.icons8.com/?size=100&id=18593&format=png&color=000000',  // Heavy rain
        61: 'https://openweathermap.org/img/wn/09d.png',  // Showers
        63: 'https://openweathermap.org/img/wn/10d.png',  // Heavy showers
        71: 'https://openweathermap.org/img/wn/13d.png',  // Light snow
        73: 'https://openweathermap.org/img/wn/13d.png',  // Moderate snow
        75: 'https://openweathermap.org/img/wn/13d.png',  // Heavy snow
        77: 'https://openweathermap.org/img/wn/13d.png',  // Snow grains
        80: 'https://openweathermap.org/img/wn/09d.png',  // Showers of rain
        81: 'https://openweathermap.org/img/wn/10d.png',  // Heavy showers of rain
        82: 'https://openweathermap.org/img/wn/11d.png',  // Thunderstorm
    };

    return icons[weatherCode] || 'https://openweathermap.org/img/wn/01d.png';  // Default icon (clear sky)
}
