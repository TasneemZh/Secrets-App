// Node.js packages
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");
const app = express();

// DB configuration
mongoose.connect("mongodb://localhost/secretDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

// Security: encryption by mongoose
db.connect({
  encKey: process.env.ENC_KEY;
});
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("The database is connected successfully!")
});

// DB schema
const secretSchema = new mongoose.Schema({
  email: String,
  password: String
});

secretSchema.plugin(encrypt, {
  secret: encKey,
  encryptedFields: ["password"]
});

// DB model
const secretModel = mongoose.model("secrets", secretSchema);

// Server code
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Get method
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

// Post method
app.post("/register", function(req, res) {
  const newSecret = new secretModel({
    email: req.body.username,
    password: req.body.password
  });
  newSecret.save(function(err) {
    if (!err) {
      console.log("New member has been added successfully!");
    }
  });
  res.redirect("/");
});

app.post("/login", function(req, res) {
  secretModel.findOne({ // Decrypt the password because of 'doc'
    email: req.body.username
  }, function(err, doc) {
    if (!err) {
      if (doc) {
        if (doc.password === req.body.password) {
          res.render("secrets");
        }
      }
    } else {
      console.log(err);
    }
  });
});

// Server port
app.listen(3000, function(req, res) {
  console.log("The server is running on 3000...");
});
