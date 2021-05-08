// Node.js packages
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

// Server code
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: "This is a very valuable secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// DB configuration
mongoose.connect("mongodb://localhost/secretDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("The database is connected successfully!")
});

// DB schema
const secretSchema = new mongoose.Schema({
  username: String,
  password: String,
  socialId: String,
  secret: Array
});

secretSchema.plugin(passportLocalMongoose);
secretSchema.plugin(findOrCreate);

// DB model
const secretModel = mongoose.model("secrets", secretSchema);

passport.use(secretModel.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  secretModel.findById(id, function(err, user) {
    done(err, user);
  });
});

// Google authentication strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Substitute your google "App ID"
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Substitute your google "Client Secret"
    callbackURL: "http://localhost:3000/auth/google/secrets-app"
  },
  function(accessToken, refreshToken, profile, cb) {
    secretModel.findOrCreate({
      socialId: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));

// Facebook authentication strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID, // Substitute your google "App ID"
    clientSecret: process.env.FACEBOOK_APP_SECRET, // Substitute your facebook "App Secret"
    callbackURL: "http://localhost:3000/auth/facebook/secrets-app"
  },
  function(accessToken, refreshToken, profile, cb) {
    secretModel.findOrCreate({
      socialId: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));

// Google Get method
app.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile"]
  }));

app.get("/auth/google/secrets-app",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

// Facebook Get method
app.get("/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"]
  }));

app.get("/auth/facebook/secrets-app",
  passport.authenticate("facebook", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

// General paths
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/secrets", function(req, res) {
  secretModel.find({
    "secret": {
      "$ne": ""
    }
  }, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      if (docs) {
        res.render("secrets", {
          docs: docs
        });
      }
    }
  });
});

app.get("/submit", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

// Post method
app.post("/register", function(req, res) {
  secretModel.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/login", function(req, res) {
  const newSecret = new secretModel({
    username: req.body.username,
    password: req.body.password
  });

  req.login(newSecret, function(err) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/submit", function(req, res) {
  secretModel.findById({
    _id: req.user.id // When creating DB, data gets saved to req.user
  }, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      if (doc) {
        (doc.secret).push(req.body.secret);

        doc.save(function() {
          res.redirect("/secrets");
        });
      }
    }
  });
});

// Server port
app.listen(3000, function(req, res) {
  console.log("The server is running on 3000...");
});
