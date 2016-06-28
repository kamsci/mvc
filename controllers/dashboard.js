var express = require("express");
var db = require("../models");
var request = require("request");
var passport = require("../config/ppConfig");
var isLoggedIn = require("../middleware/isLoggedIn");
var router = express.Router();
// highcharts global variables
var ratioArray = [];

//////////////////////////////////////////

router.get("/", isLoggedIn, function(req, res) {
  res.render("dashboard.ejs");
});

router.get("/data", isLoggedIn, function(req, res) {
  res.render("data.ejs");
});

router.get("q-new-dataset", function(req, res) {
  db.hospital.findAll()
  .then(function(array) {
    console.log("Array: ", array);
  })
})
router.post("/q-new-dataset", isLoggedIn, function(req, res) {
  db.dataset.create({
    where: req.body.hospital
  })
});

router.get("/q-dataset", isLoggedIn, function(req, res) {
  request({
    url: "https://data.medicare.gov/resource/kac9-a9fp.json",
    where: { state: "PA"}
  }, function(error, response, data) {
    if (!error && response.statusCode === 200) {
      var dataArray = JSON.parse(data);
      for (var i = 0; i < dataArray.length; i++) {
        console.log(dataArray[i].readm_ratio);
        // ratioArray.push(data[i].readm_ratio)
      }
      // console.log(ratioArray);
      console.log(dataArray.length);
      res.redirect("/dashboard");
    }
  })
})

//////////////////////////////////////////
module.exports = router;
