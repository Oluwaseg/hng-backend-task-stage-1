require("dotenv").config();

const express = require("express");
const requestIp = require("request-ip");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;
const geoApiKey = process.env.geoApiKey; // ipgeolocation.io API key

app.use(requestIp.mw());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Geolocation API</title>
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
        <h1>Welcome to the Geolocation API</h1>
        <p>Use the following links to get started:</p>
        <p><a href="/api/hello">/api/hello</a> - Get a greeting with your IP and location</p>
        <p><a href="/api/hello?visitor_name=yourname">/api/hello?visitor_name=yourname</a> - Personalize the greeting</p>
    </body>
    </html>
  `);
});

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";
  let clientIp = req.clientIp;

  if (clientIp === "::1" || clientIp === "127.0.0.1") {
    clientIp = "8.8.8.8"; // Google's public DNS IP address for testing
  }

  try {
    const response = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${geoApiKey}&ip=${clientIp}&include=weather`
    );

    const location = response.data.city || "Unknown";
    const temperature = response.data.weather.temperature || "Unknown";

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`,
    });
  } catch (error) {
    res.json({
      client_ip: clientIp,
      location: "Unknown",
      greeting: `Hello, ${visitorName}! The temperature is unknown in your location.`,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
