require("dotenv").config(); // Load dotenv configuration

const express = require("express");
const requestIp = require("request-ip");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;
const geoApiKey = process.env.geoApiKey;
const weatherApiKey = process.env.weatherApiKey;

// Middleware to get client's IP address
app.use(requestIp.mw());

// Route to handle GET requests to root /
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IPGeolocation API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
            }
            h1 {
                color: #3498db;
            }
            a {
                color: #2ecc71;
                text-decoration: none;
                margin: 5px;
                padding: 10px 20px;
                border: 1px solid #2ecc71;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }
            a:hover {
                background-color: #2ecc71;
                color: #fff;
            }
        </style>
    </head>
    <body>
        <h1>Welcome to the IPGeolocation API</h1>
        <p>Use the following links to get started:</p>
        <p><a href="/api/hello">/api/hello</a> - Get a greeting with your IP and location</p>
        <p><a href="/api/hello?visitor_name=yourname">/api/hello?visitor_name=yourname</a> - Personalize the greeting</p>
    </body>
    </html>
  `);
});

// Route to handle GET requests to /api/hello
app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest"; // Get visitor name from query parameter or default to "Guest"
  const clientIp = req.clientIp; // Get client's IP address from middleware

  try {
    // Fetch geolocation data based on client's IP address using IPGeolocation API
    const geoResponse = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${geoApiKey}&ip=${clientIp}`
    );
    const location = geoResponse.data.city || "Unknown"; // Extract city from geolocation response or default to "Unknown"

    let temperature = "Unknown";
    if (location !== "Unknown") {
      // Fetch weather data based on the location using OpenWeatherMap API
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${weatherApiKey}`
      );
      temperature = weatherResponse.data.main.temp; // Extract temperature from weather response
    }

    // Respond with JSON containing client's IP, location, temperature, and a greeting message
    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`,
    });
  } catch (error) {
    // If there's an error fetching geolocation or weather data, respond with default values
    res.json({
      client_ip: clientIp,
      location: "Unknown",
      greeting: `Hello, ${visitorName}! The temperature is unknown in your location.`,
    });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
