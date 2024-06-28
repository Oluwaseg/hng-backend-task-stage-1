require("dotenv").config(); // Load dotenv configuration

const express = require("express");
const requestIp = require("request-ip");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;
const geoApiKey = process.env.geoApiKey;

// Middleware to get client's IP address
app.use(requestIp.mw());

// Route to handle GET requests to root /
app.get("/", (req, res) => {
  res.send(`Welcome to the IPGeolocation API.<br>
            Use <a href="/api/hello">/api/hello</a> to get a greeting with your IP and location,<br>
            or <a href="/api/hello?visitor_name=yourname">/api/hello?visitor_name=yourname</a> to personalize the greeting.`);
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

    // Respond with JSON containing client's IP, location, and a greeting message
    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}!`,
    });
  } catch (error) {
    // If there's an error fetching geolocation data, respond with default values
    res.json({
      client_ip: clientIp,
      location: "Unknown",
      greeting: `Hello, ${visitorName}!`,
    });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
