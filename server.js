"use strict";

const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.set("port", 3000);

// Log requests to the console for development debugging
app.use(morgan("dev"));
 
// Direct requests for static resources to the `public` folder
app.use("/", express.static(path.join(__dirname, "public")));

// Parse `application/json` data on requests. Data will then be available on 
// `req.body` object
app.use(express.json());

// Handle requests for occupation data. For now, simply log what was requested 
// to the console. All requests receive the same json response.
app.post("/api/occupations", (req, res, next) => {
  console.log("You requested:", req.body);

  const DATA = path.join(__dirname, "ProjectSampleResponseData.json");

  try {
    const data = fs.readFileSync(DATA, "utf8");
    res.json(JSON.parse(data)); 
  } catch (error) {
    next(error);
  }
});

// Error handler
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(500).send("There was an error on the server.");
});

// Start server and log where it can be found
app.listen(app.get("port"), () => {
  console.log(`Server listening at http://localhost:${app.get("port")}/`);
});


