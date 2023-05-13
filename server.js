/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Yongda Long
 *  Student ID: 172800211
 *  Date: May 19, 2023
 *  Heroku Link: https://yongdalong.cyclic.app
 *
 ********************************************************************************/

// Dependencies
const express = require("express");
const cors = require("cors");
const TripDB = require("./modules/tripsDB.js");

require("dotenv").config();

const app = express();
const db = new TripDB();

app.use(cors());
app.use(express.json());

const HTTP_PORT = process.env.PORT || 8080;

// API Routes

app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

app.get("/home", (req, res) => {
  res.json({ message: "API Listening" });
});

app.post("/api/trips", (req, res) => {
  db.addNewTrip(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.get("/api/trips", (req, res) => {
  let query = req.query;
  if (!query.page || !query.perPage) {
    return res
      .status(400)
      .json({ error: "Query parameter not valid, missing parameters." });
  }
  if (isNaN(query.page) || isNaN(query.perPage)) {
    return res.status(400).json({
      error: "Query parameter not valid, parameter type is incorrect.",
    });
  }
  db.getAllTrips(req.query.page, req.query.perPage)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.get("/api/trips/:id", (req, res) => {
  db.getTripById(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.put("/api/trips/:id", (req, res) => {
  db.updateTripById(req.body, req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.delete("/api/trips/:id", (req, res) => {
  db.deleteTripById(req.params.id)
    .then(() => {
      res.status(204);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Initialize
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// 404
app.use((req, res) => {
  res.status(404).send("404 Page Not Found!");
});
