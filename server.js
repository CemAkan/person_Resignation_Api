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

// --> sign-in <--
app.get("/resignation", (req, res) => {
  let body = _.pick(req.body, "username", "password");
  dataBase.Person.findOne({
    where: {
      username: body.username,
      password: body.password,
    },
    //--> login chech <--
  }).then((todos) => {
    if (todos != null) {
      res.send("You succesfully logined.");
    } else {
      res.send("You can not login, please try again.");
    }
  }),
    () => {
      res.status(404).send({
        error: "You can not login, please try again.",
      });
    };
});

//--> list all <--
app.get("/users/list", (req, res) => {
  let body = _.pick(req.body, "username", "password");

  dataBase.Person.findAll().then((resign) => {
    res.json(resign);
  });
});

// --> sign-up <--
app.post("/users/sign-up", (req, res) => {
  let body = _.pick(req.body, "username", "email", "password");
  dataBase.Person.create(body).then(
    (resign) => {
      res.json(resign);
    },
    (err) => {
      res.status(400).send({
        error: "Please use correct writing rules.",
      });
    }
  );
});

// --> update profile <--
app.put("/users/update-profile/:id", (req, res) => {
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

// --> delete profile <--
app.delete("/delete-profile/:id", (req, res) => {
  let personId = req.params.id;
  dataBase.Person.destroy({
    where: {
      id: personId,
    },
  }).then(
    (rowdeleted) => {
      if (rowdeleted === 0) {
        res.status(404).send({
          error: "Person can not found.",
        });
      } else {
        res.status(204).send();
      }
    },
    () => {
      res.status(500).send();
    }
  );
});
