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
  db.hospital.findAll()
  .then(function(hospitals) {
    // console.log("Obj: ", hospitals);
    res.render("data.ejs", { hospitals: hospitals });
  });
});

router.post("/new-dataset", isLoggedIn, function(req, res) {
  // var hospital = {};
  // var benchmark = {};
  // var dashboard = {};
  var array = req.body.hospital.split(" - ");
  var id = array[1];
  db.hospital.find({
    where: { provider_id: id }
  })
  .then(function(hos) {
    // hospital = hos;
    db.benchmark.create({
      name: req.body.state,
      type: "location"
    })
    .then(function(bench) {
      // benchmark = bench;
      var user = req.session.passport.user;
      db.dataset.create({
          name: req.body.dataset,
          userId: user,
          hospitalId: hos.id,
          benchmarkId: bench.id
      })
      .then(function(dash) {
        console.log("@Hospital:", hospital);
        console.log("@Benchmark:", benchmark);
        console.log("@Dash:", dash);
        res.render("data.ejs", { datasetH: hos, datasetB: bench, dash: dash });

      })
      .catch(function(error) {
        console.log("DataSet Create Error")
      });
    });
  });
});

router.get("/q-dataset", isLoggedIn, function(req, res) {
  request({
    url: "https://data.medicare.gov/resource/kac9-a9fp.json",
    where: { state: "PA"}
  }, function(error, response, data) {
    if (!error && response.statusCode === 200) {
      var dataArray = JSON.parse(data);
      for (var i = 0; i < dataArray.length; i++) {
        // console.log(dataArray[i].readm_ratio);
        // ratioArray.push(data[i].readm_ratio)
      }
      // console.log(ratioArray);
      // console.log(dataArray.length);
      res.redirect("/dashboard");
    }
  })
})

//////////////////////////////////////////
module.exports = router;
