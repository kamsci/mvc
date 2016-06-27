var express = require('express');
var db = require("../models");
var request = require("request");
var passport = require("../config/ppConfig");
var isLoggedIn = require("../middleware/isLoggedIn");
var router = express.Router();

//////////////////////////////////////////

router.get('/', isLoggedIn, function(req, res) {
  res.render('dashboard.ejs');
});

router.post("/q-provider", isLoggedIn, function(req, res) {
  request({
    url: "https://data.medicare.gov/resource/rbry-mqwu.json",
    qs: { provider_id: req.body.provider }
  }, function(error, response, data) {
      if (!error && response.statusCode == 200) {
        console.log(data);
      }
  });
// }).then(function(data) {
// }).catch(function(error) {
});


//////////////////////////////////////////
module.exports = router;
