var express = require('express');
var db = require("../models");
var passport = require("../config/ppConfig");
var isLoggedIn = require("../middleware/isLoggedIn");
var router = express.Router();

//////////////////////////////////////////

router.get('/', isLoggedIn, function(req, res) {
  res.render('dashboard.ejs');
});

//////////////////////////////////////////
module.exports = router;
