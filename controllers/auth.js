var express = require('express');
var db = require("../models");
var passport = require("../config/ppConfig");
var router = express.Router();

//////////////////////////////////////////

// router.get('/signup', function(req, res) {
//   res.render('auth/signup');
// });


// router.get('/login', function(req, res) {
//   res.redirect('../profile');
// });


module.exports = router;
