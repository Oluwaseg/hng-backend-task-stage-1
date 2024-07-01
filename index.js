require("dotenv").config(); // Load dotenv configuration

const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;
const weatherUrl = "https://api.weatherapi.com/v1";

// Route to handle GET requests to /api/hello
app.get("/api/hello", async (req, res) => {
  try {
    // Get the client's IP address from headers (using x-forwarded-for as an example)
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Make API request to fetch weather data based on client's IP
    const response = await axios.get(
      `${weatherUrl}/current.json?key=${process.env.weatherApiKey}&q=${ip}`
    );

    // Extract relevant data from API response
    const data = response.data;
    const result = {
      client_ip: ip,
      location: data.location.name,
      greeting: `Hello, sam! The temperature is ${data.current.temp_c} degrees Celsius in ${data.location.name}.`,
    };

    // Send the formatted result as JSON response
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
