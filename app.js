const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/users");
const crypto = require("crypto");
const key = "abobakar";
const algo = "aes256";
const jwt = require("jsonwebtoken");
const { find } = require("./models/users");

jwtKye = "jwt";
app.use(express.json());
const port = 4113;

//database

const mongodb =
  "mongodb+srv://abobakar786:rana786@cluster0.ojybe.mongodb.net/jwt2?retryWrites=true&w=majority";
mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("welcome to nodejs");
});
app.listen(port, () => {
  console.log(`server work on port on ${port}`);
});

//********Register************* */

app.post("/register", (req, res) => {
  var cipher = crypto.createCipher(algo, key);
  var encrypted =
    cipher.update(req.body.password, "utf8", "hex") + cipher.final("hex");

  const user = new User({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    password: encrypted,
  });
  user
    .save()
    .then((data) => {
      jwt.sign({ data }, jwtKye, { expiresIn: "300s" }, (err, token) => {
        res.send(token);
      });
    })
    .catch((err) => res.send(err));
});

//**login */

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((data) => {
      var decipher = crypto.createDecipher(algo, key);
      var decrypted =
        decipher.update(data.password, "hex", "utf8") + decipher.final("utf8");
      if (decrypted == req.body.password) {
        jwt.sign(
          { data },
          jwtKye,
          { expiresIn: "9999999999999999999s" },
          (err, token) => {
            res.send(token);
          }
        );
      }
      // res.send(decrypted)
    })
    .catch((err) => res.send(err));
});

app.get("/users", varifyToken, (req, res) => {
  User.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.send(err));
});

app.post("/update", varifyToken, (req, res) => {
  User.findOneAndUpdate({ id: req.body.id }, req.body)
    .then(() => res.send("data is update"))
    .catch((err) => res.send(err));
});

app.post("/delete", varifyToken, (req, res) => {
  User.findOneAndDelete({ id: req.body.id })
    .then(() => res.send("data is delete"))
    .catch((err) => res.send(err));
});

app.get("/find", varifyToken, (req, res) => {
  User.find()
    .then((data) => res.send(data))
    .catch((err) => res.send({ err: err }));
});

function varifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    req.token = bearer[1];

    jwt.verify(req.token, jwtKye, (err, authData) => {
      if (err) {
        res.send({ data: err });
      } else {
        next();
      }
    });
  } else {
    res.send("Token not provided");
  }
}
