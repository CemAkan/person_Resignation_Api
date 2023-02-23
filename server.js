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

// --> put request <--
app.put("/resignation/:id", (req, res) => {
  let personId = req.params.id;
  let body = _.pick(req.body, "username", "email", "password");
  let attributes = {};

  if (body.hasOwnProperty("username")) {
    attributes.username = body.username;
  }

  if (body.hasOwnProperty("email")) {
    attributes.email = body.email;
  }

  if (body.hasOwnProperty("password")) {
    attributes.password = body.password;
  }

  dataBase.Person.findOne({
    where: {
      id: personId,
    },
  }).then(
    (resign) => {
      if (resign) {
        resign.update(attributes).then(
          (resign) => {
            res.json(resign);
          },
          () => {
            res.status(400).send();
          }
        );
      } else {
        res.status(404).send({
          error: "Person can not found.",
        });
      }
    },
    () => {
      res.status(500).send();
    }
  );
});
