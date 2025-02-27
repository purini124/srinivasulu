const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const port = 11000;

// Serve static files like styles.css, favicon.ico
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get coordinates using OpenCage Geocoder API
app.get('/get-coordinates', async (req, res) => {
    const cityName = req.query.city;
    const apiKey = process.env.OPENCAGE_API_KEY; // Use the API key from environment variables

    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${apiKey}`);
        const data = response.data;

        if (data.results.length === 0) {
            return res.status(404).json({ error: 'City not found' });
        }

        const { lat, lng } = data.results[0].geometry;
        res.json({ latitude: lat, longitude: lng });
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        res.status(500).json({ error: 'Error fetching coordinates' });
    }
});

// API endpoint to get current weather using Open-Meteo API
app.get('/get-weather', async (req, res) => {
    const { latitude, longitude } = req.query;

    try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude,
                longitude,
                current_weather: true,
            }
        });

        const weatherData = response.data.current_weather;

        if (weatherData) {
            res.json({
                temperature: weatherData.temperature,
                wind_speed: weatherData.windspeed,
                humidity: weatherData.humidity,  // Ensure this is being returned
                weather_code: weatherData.weathercode
            });
        } else {
            res.status(500).json({ error: 'Weather data not available' });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
