var express = require("express");
var db = require("../models");
var request = require("request");
var passport = require("../config/ppConfig");
var isLoggedIn = require("../middleware/isLoggedIn");
var router = express.Router();
// highcharts global variables
var ratioArray = [];

//////////////////////////////////////////

// Dashboard - Report Page
router.get("/", isLoggedIn, function(req, res) {
  res.render("dashboard.ejs");
});
// POPULATE - user data in My Libraries
router.get("/data", isLoggedIn, function(req, res) {
  var user = req.session.passport.user;
  db.hospital.findAll()
  .then(function(hospitals) {
    db.dataset.findAll({
      where: { userId: user },
      include: [db.benchmark, db.hospital]
    })
    .then(function(dataset) {
      // console.log("@Data:", dataset[0].benchmark.name);
      res.render("data.ejs", { hospitals: hospitals, userData: dataset });
    });
  });
});
// FORM - Add dashboard dataset
router.post("/new-dataset", isLoggedIn, function(req, res) {
  var array = req.body.hospital.split(" - ");
  var id = array[1];
  db.hospital.find({
    where: { provider_id: id }
  })
  .then(function(hos) {
    db.benchmark.create({
      name: req.body.state,
      type: "location"
    })
    .then(function(bench) {
      var user = req.session.passport.user;
      db.dataset.create({
        name: req.body.dataset,
        userId: user,
        hospitalId: hos.id,
        benchmarkId: bench.id
      })
      .catch(function(error) {
        console.log("Error Creating DataSet")
      });
    });
  });
});
// FORM - Select dataset from Library
router.get("/q-dataset", isLoggedIn, function(req, res) {
  db.dataset.find({
    where: { name: req.body.library },
    include: [db.benchmark]
  })
  .then(function(dataset) {
    console.log("@Dataset:", dataset);
  })
  // request({
  //   url: "https://data.medicare.gov/resource/kac9-a9fp.json",
  //   where: { state: "PA"}
  // }, function(error, response, data) {
  //   if (!error && response.statusCode === 200) {
  //     var dataArray = JSON.parse(data);
  //     for (var i = 0; i < dataArray.length; i++) {
  //       // console.log(dataArray[i].readm_ratio);
  //       // ratioArray.push(data[i].readm_ratio)
  //     }
  //     // console.log(ratioArray);
  //     // console.log(dataArray.length);
  //     res.redirect("/dashboard");
  //   }
  // })
})

//////////////////////////////////////////
module.exports = router;
