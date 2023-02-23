var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var _ = require("underscore");
require("dotenv").config();

var PORT = process.env.PORT;

// --> Data Base Connection <--
var dataBase = require("./connect.js");

// --> Open a Port <--
dataBase.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("Working on port: " + PORT);
  });
});

// --> get request <--
app.get("/resignation", (req, res) => {
  dataBase.Person.findAll().then((resign) => {
    res.json(resign);
  });
});

// --> post request <--
app.post("/resignation", (req, res) => {
  let body = _.pick(req.body, "username", "email", "password");
  dataBase.Person.create(body).then((resign) => {
    res.json(resign);
  }),
    () => {
      res.status(400).send({
        error: "Please use correct writing rules.",
      });
    };
});
