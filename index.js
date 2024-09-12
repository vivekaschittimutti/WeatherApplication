const bcrypt = require("bcryptjs");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// SQLite database setup
const db = new sqlite3.Database("./weather.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database connected Successfully!");
  }
});

const authMiddleware = (req, res, next) => {
  const userId = 1;
  req.user = { id: userId };
  next();
};

app.listen(8000, () => {
  console.log("Server started on port 8000");
});

// User registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) return res.status(400).send("User already exists");
      res.status(201).send("User registered successfully");
    }
  );
});

// User login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user) return res.status(404).send("User not found");

    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) return res.status(500).send("Error during authentication");
      if (!isValid) return res.status(401).send("Invalid password");
      res.status(200).send("Logged in successfully");
    });
  });
});

app.post("/weather", authMiddleware, async (req, res) => {
  const { location } = req.body;
  const API_KEY = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;

  try {
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(url);
    const weatherData = await response.json();

    if (weatherData.cod !== 200) {
      return res.status(weatherData.cod).send(weatherData.message);
    }

    const userId = req.user.id;
    db.run(
      "INSERT INTO search_history (user_id, location, weather_data) VALUES (?, ?, ?)",
      [userId, location, JSON.stringify(weatherData)]
    );

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).send("Error retrieving weather data");
  }
});

// Get search history
app.get("/history", authMiddleware, (req, res) => {
  const userId = req.user.id;

  db.all(
    "SELECT * FROM search_history WHERE user_id = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).send("Error retrieving history");
      res.status(200).json(rows);
    }
  );
});

// Delete a history entry
app.delete("/history/:id", authMiddleware, (req, res) => {
  const historyId = req.params.id;

  db.run("DELETE FROM search_history WHERE id = ?", [historyId], (err) => {
    if (err) return res.status(500).send("Error deleting entry");
    res.status(200).send("Entry deleted");
  });
});
