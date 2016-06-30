var express = require("express");
var db = require("../models");
var request = require("request");
var passport = require("../config/ppConfig");
var isLoggedIn = require("../middleware/isLoggedIn");
var session = require("express-session");
var router = express.Router();
// highcharts global variables
// var ratioArray = [];

//////////////////////////////////////////

// Dashboard - Report Page
router.get("/", isLoggedIn, function(req, res) {
  console.log(req.session);
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

// FROM - Save dataset request in session storage
router.post("/q-dataset", isLoggedIn, function(req, res) {
  req.session.store = req.body.library
  // session.Store.setItem("library", req.body.library);
  res.redirect("/dashboard/");
});

// FORM - Select dataset from Library
router.get("/q-dataset", isLoggedIn, function(req, res) {
  var user = req.session.passport.user;
  var library = req.session.store;
  // Array with CMS measures we query for in API
  // KEY FOR ORDER IN CHART!!
  var measureArray = ["READM-30-COPD-HRRP", "READM-30-HIP-KNEE-HRRP", "READM-30-AMI-HRRP", "READM-30-HF-HRRP", "READM-30-PN-HRRP"]
  //Object ready for Measure ratios for hospital & benchmark
  var ratioObjAll = {};
  //Object ready for Measure readmission %  for hospital & benchmark
  var readmissionObjAll = {};
  // START QUERIES!
  console.log("@Library", library)
  db.dataset.find({
    where: {
      userId: user,
      name: library
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
        var singleHospitalArray = JSON.parse(data);
        // Get 'Excess Readmissions Ratio' for EACH Measure for hospital
        var ratioHospitalArr = [];
        var readmPercentHospitalArr = [];
        measureArray.forEach(function(measure) {
          for(var i = 0; i < singleHospitalArray.length; i++) {
            if (singleHospitalArray[i].measure_id === measure) {
              // Find and add excess ratio to ratioObjAll
              ratioHospitalArr.push(singleHospitalArray[i].readm_ratio);
              // Find and add readmission % to readmissionObjAll
              var readmPercentHospital = (
                singleHospitalArray[i].number_of_readmissions
                / singleHospitalArray[i].number_of_discharges)
                * 100;
              readmPercentHospital = parseFloat(readmPercentHospital.toFixed(2));
              readmPercentHospitalArr.push(readmPercentHospital);
            }
          }
        }); // end forEach(measure) HOSPITAL
        ratioObjAll.hospital = ratioHospitalArr;
        readmissionObjAll.hospital = readmPercentHospitalArr;
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
          // Place holder arrays
          var ratioTopBot = [];
          var readmPercentHospitalArr = [];
          // Get 'Excess Readmissions Ratio' for EACH measure for all hosptials in the ST
          measureArray.forEach(function(measure) {
            var ratioArray = [];
            for (var i = 0; i < dataArray.length; i++) {
              if ((dataArray[i].measure_id === measure)
               && (dataArray[i].readm_ratio !== "Not Available")
               && (dataArray[i].readm_ratio !== "Too Few to Report"))
              {
                ratioArray.push(dataArray[i].readm_ratio);
              }
              // Total readmissions and discharges for combined hostitals in the ST
              if ((dataArray[i].measure_id === measure)
               && (dataArray[i].number_of_readmissions !== "Not Available")
               && (dataArray[i].number_of_readmissions !== "Too Few to Report")
               && (dataArray[i].number_of_discharges !== "Not Available")
               && (dataArray[i].number_of_discharges !== "Too Few to Report"))
              {
                var totalReadmins =+ dataArray[i].number_of_readmissions;
                var totalDischarges =+ dataArray[i].number_of_discharges;
              }
            } // end for loop
            // Percent of readmissions out of discharges for the ST
            var readminPercentbyST = (totalReadmins / totalDischarges) * 100;
            readminPercentbyST = parseFloat(readminPercentbyST.toFixed(2));
            readmPercentHospitalArr.push(readminPercentbyST);
            // Sort and store only top and bottom 'Excess Readmissions Ratio'
            ratioArray = ratioArray.sort(function(a, b) { return a - b });
            var sortedArray = [];
            sortedArray.push(ratioArray[0], ratioArray[ratioArray.length - 1]);
            ratioTopBot.push(sortedArray);
          }); // End forEach(measure) - Benchmarks
          // Add ratio and readmission percent arrays to main obj
          ratioObjAll.benchmark = ratioTopBot;
          readmissionObjAll.benchmark = readmPercentHospitalArr;
          // Data used in app.js via AJAX
          console.log("@ratioObjAll:", ratioObjAll);
          console.log("@readmissionObjAll:", readmissionObjAll);
          res.json({ readmissionObjAll: readmissionObjAll, ratioObjAll: ratioObjAll });
        }
      });// end STATE request function
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
          // Place holder arrays
          var ratioTopBot = [];
          var readmPercentHospitalArr = [];
          // Get 'Excess Readmissions Ratio' for EACH measure for all hosptials in the US
          measureArray.forEach(function(measure) {
            var ratioArray = [];
            for (var i = 0; i < dataArray.length; i++) {
              if ((dataArray[i].measure_id === measure)
               && (dataArray[i].readm_ratio !== "Not Available")
               && (dataArray[i].readm_ratio !== "Too Few to Report"))
              {
                ratioArray.push(dataArray[i].readm_ratio);
              }
              // Total readmissions and discharges for combined hostitals in the US
              if ((dataArray[i].measure_id === measure)
               && (dataArray[i].number_of_readmissions !== "Not Available")
               && (dataArray[i].number_of_readmissions !== "Too Few to Report")
               && (dataArray[i].number_of_discharges !== "Not Available")
               && (dataArray[i].number_of_discharges !== "Too Few to Report"))
              {
                var totalReadmins =+ dataArray[i].number_of_readmissions;
                var totalDischarges =+ dataArray[i].number_of_discharges;
              }
            } // end for loop
            // Percent of readmissions out of discharges for the US
            var readminPercentbyST = (totalReadmins / totalDischarges) * 100;
            readmPercentHospitalArr.push(readminPercentbyST);
            // Sort and store only top and bottom 'Excess Readmissions Ratio'
            ratioArray = ratioArray.sort(function(a, b) { return a - b });
            var sortedArray = [];
            sortedArray.push(ratioArray[0], ratioArray[ratioArray.length - 1]);
            ratioTopBot.push(sortedArray);
          }); // End forEach(measure) - Benchmarks
          // Add ratio and readmission percent arrays to main obj
          ratioObjAll.benchmark = ratioTopBot;
          readmissionObjAll.benchmark = readmPercentHospitalArr;
          console.log("@ratioObjAll:", ratioObjAll);
          console.log("@readmissionObjAll:", readmissionObjAll);
          // Data used in app.js via AJAX
          res.json({ readmissionObjAll: readmissionObjAll, ratioObjAll: ratioObjAll });
        }
      });// end US request function
    }
  });
});

//////////////////////////////////////////
module.exports = router;
