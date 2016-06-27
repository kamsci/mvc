var express = require('express');
var db = require("./models");
var request = require("request");
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require("express-session");
var passport = require("./config/ppConfig");
var flash = require("connect-flash");
var isLoggedIn = require("./middleware/isLoggedIn");
var app = express();
var Highcharts = require('highcharts');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public/'));
app.use(session ({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// flash relies on session first
app.use(flash());
app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})


app.get('/', function(req, res) {
  res.render('index');
});

// POST Modal action /signup
app.post("/signup", function(req, res) {
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function (user, created) {
    if (created) {
      passport.authenticate("local", {
        successRedirect: "/dashboard",
        successFlash: "User created. You are logged in."
      })(req, res);
    } else {
      req.flash("Error", "User with that email already exists");
      res.redirect("/");
    }
  }).catch(function(error) {
    console.log("Create User Error Occured", error.message);
    res.redirect("/");
  })
});

// POST Modal action /login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/",
  failureFlash: "Login Failed"
}));

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

// app.use('/auth', require('./controllers/auth'));
app.use("/dashboard", require("./controllers/dashboard"));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
