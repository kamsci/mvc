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
    db.benchmark.findOrCreate({
      where: { name: req.body.state },
      defaults: { type: "location" }
    })
    .spread(function(bench, created) {
      var user = req.session.passport.user;
      bench.createDataset({
        name: req.body.dataset,
        userId: user,
        hospitalId: hos.id,
        benchmarkId: bench.id
      })
      .catch(function(error) {
        console.log("Error Creating DataSet")
      });
      res.redirect("/dashboard/data");
    });
  });
});

// FORM - Select dataset from Library
router.post("/q-dataset", isLoggedIn, function(req, res) {
  var user = req.session.passport.user;
  db.dataset.find({
    where: {
      userId: user,
      name: req.body.library
    },
    include: [db.benchmark, db.hospital]
  })
  .then(function(dataset) {
    // Data for selected hospital
    request({
      url: "https://data.medicare.gov/resource/kac9-a9fp.json",
      qs: {
        provider_id: dataset.hospital.provider_id
      }
    }, function(error, response, data) {
      if(!error && response.statusCode === 200) {
        var singleArray = JSON.parse(data);
        // Get 'Excess Readmissions Ratio' for hospital
        var ratioHospital = singleArray[0].readm_ratio;
        var readmPercentHospital = (
          singleArray[0].number_of_readmissions
          / singleArray[0].number_of_discharges )
          * 100;

        console.log("Ratio:", ratioHospital);
        console.log("num:", singleArray[0].number_of_readmissions, "den:", singleArray[0].number_of_discharges);
        console.log("percent:", readmPercentHospital);
      };
    });
    // IF BENCHMARK = STATE; not United States
    if (dataset.benchmark.name !== "United States") {
      request({
        url: "https://data.medicare.gov/resource/kac9-a9fp.json",
        qs: {
          state: dataset.benchmark.name
        }
      }, function(error, response, data) {
        if (!error && response.statusCode === 200) {
          var dataArray = JSON.parse(data);
          // Stores top and bottom ratio for ST
          var measureArray = ["READM-30-COPD-HRR", "READM-30-HIP-KNEE-HRRP", "READM-30-AMI-HRRP", "READM-30-HF-HRRP", "READM-30-PN-HRRP"]
          var ratioObjAll = {};
          // Get 'Excess Readmissions Ratio' for EACH measure for all hosptials in the ST
          for (var i = 0; i < dataArray.length; i++) {
            if ((dataArray[i].readm_ratio !== "Not Available")
             && (dataArray[i].readm_ratio !== "Too Few to Report")) {
              ratioArray.push(dataArray[i].readm_ratio);
            }
            // Total readmissions and discharges for combined hostitals in the ST
            if ((dataArray[i].number_of_readmissions !== "Not Available")
             && (dataArray[i].number_of_readmissions !== "Too Few to Report")
             && (dataArray[i].number_of_discharges !== "Not Available")
             && (dataArray[i].number_of_discharges !== "Too Few to Report"))
            {
              var totalReadmins =+ dataArray[i].number_of_readmissions;
              var totalDischarges =+ dataArray[i].number_of_discharges;
            }
          }
          // Percent of readmissions out of discharges for the ST
          var readminPercentbyST = (totalReadmins / totalDischarges) * 100;
          // Sort and store only top and bottom 'Excess Readmissions Ratio'
          ratioArray = ratioArray.sort(function(a, b) { return a - b });
          var ratioFinal = [];
          ratioFinal.push(ratioArray[0], ratioArray[ratioArray.length - 1]);
          // View report - redirect to dashboard
          res.redirect("/dashboard");
        }
      })
    } else {
     // IF BENCHMARK = UNITED STATES
      request(
      {
        url: "https://data.medicare.gov/resource/kac9-a9fp.json"
      },
      function(error, response, data) {
        if (!error && response.statusCode === 200) {
          var dataArray = JSON.parse(data);
          // Stores top and bottom ratio for US
          var ratioArray = [];
          // Get 'Excess Readmissions Ratio' for all hosptials in the US
          for (var i = 0; i < dataArray.length; i++) {
            if ((dataArray[i].readm_ratio !== "Not Available")
             && (dataArray[i].readm_ratio !== "Too Few to Report")) {
              ratioArray.push(dataArray[i].readm_ratio);
            }
            // Total readmissions and discharges for combined hostitals in the US
            if ((dataArray[i].number_of_readmissions !== "Not Available")
             && (dataArray[i].number_of_readmissions !== "Too Few to Report")
             && (dataArray[i].number_of_discharges !== "Not Available")
             && (dataArray[i].number_of_discharges !== "Too Few to Report"))
            {
              var totalReadmins =+ dataArray[i].number_of_readmissions;
              var totalDischarges =+ dataArray[i].number_of_discharges;
            }
          }
          // Percent of readmissions out of discharges for the US
          var readminPercentbyST = (totalReadmins / totalDischarges) * 100;
          // Sort and store only top and bottom 'Excess Readmissions Ratio'
          ratioArray = ratioArray.sort(function(a, b) { return a - b });
          var ratioFinal = [];
          ratioFinal.push(ratioArray[0], ratioArray[ratioArray.length - 1]);
          // View report - redirect to dashboard
          res.redirect("/dashboard");
        }
      })
    }
  })
})

//////////////////////////////////////////
module.exports = router;
