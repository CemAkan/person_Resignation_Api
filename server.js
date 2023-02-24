var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var _ = require("underscore");
const crypto = require("crypto");
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

// --> cyrpto <--
const hashAlgo = "sha256";

// --> sign-in <--
app.post("/users/sign-in", (req, res) => {
  let body = _.pick(req.body, "username", "password");

  //--> part of encrypting the password <--
  const text = body.password;
  const hash = crypto.createHash(hashAlgo).update(text).digest("hex");
  dataBase.Person.findOne({
    where: {
      username: body.username,
      password: hash,
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

  //--> part of encrypting the password <--
  const text = body.password;
  const hash = crypto.createHash(hashAlgo).update(text).digest("hex");
  body.password = hash;
  //--> password length check <--
  if (text.length < 8) {
    res.send("Please use a long password.");
  } else {
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
  }
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
app.delete("/users/delete-profile/:id", (req, res) => {
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
