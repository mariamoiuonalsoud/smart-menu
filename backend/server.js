// Main server file for initializing the Express app and setting up middleware

const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "frontend",
      "modules",
      "customer_menu",
      "index.html",
    ),
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

/*
require("dotenv").config(); // for reading variables from .env file

const app = expres(); // Initialize Express app

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all routes
*/
