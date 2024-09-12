### README.md

````md
# Weather App

A simple weather app that allows users to register, log in, view weather data for specific locations using the OpenWeather API, and manage their search history. The app uses Express, SQLite, bcrypt, and node-fetch.

## Features

- User registration and login with password hashing using bcrypt.
- Fetch weather data from the OpenWeather API.
- Store and manage search history in an SQLite database.
- Authentication middleware for managing user sessions.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/weather-app.git
   ```
````

2. Navigate to the project directory:

   ```bash
   cd weather-app
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the project and add your OpenWeather API key:

   ```
   API_KEY=your_openweather_api_key
   ```

## Usage

1. Run the app:

   ```bash
   npm start
   ```

2. The server will start on `http://localhost:8000`. The available endpoints are:

   - **POST /register**: Register a new user.

     ```bash
     curl -X POST http://localhost:8000/register -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
     ```

   - **POST /login**: Log in with an existing user.

     ```bash
     curl -X POST http://localhost:8000/login -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
     ```

   - **POST /weather**: Get weather data for a location (authenticated).

     ```bash
     curl -X POST http://localhost:8000/weather -H "Content-Type: application/json" -d '{"location": "London"}'
     ```

   - **GET /history**: Get search history for the logged-in user (authenticated).

     ```bash
     curl http://localhost:8000/history
     ```

   - **DELETE /history/:id**: Delete a specific search history entry (authenticated).
     ```bash
     curl -X DELETE http://localhost:8000/history/1
     ```

## Technologies Used

- **Node.js**: Backend server.
- **Express**: Web framework for Node.js.
- **SQLite**: Lightweight SQL database.
- **bcrypt.js**: For password hashing.
- **node-fetch**: To make API requests to OpenWeather.
- **dotenv**: To manage environment variables.

## License

This project is licensed under the MIT License.
