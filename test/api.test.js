var express = require("express");
var db = require("../models");
var request = require("request");
var session = require("express-session");

// Get hosital data - ALl in one
// request({
//   url: "https://data.medicare.gov/resource/kac9-a9fp.json",
//   qs: {
//     provider_id: 340039
//   }
// }, function(error, response, data) {
//   if(!error && response.statusCode === 200) {
//     var singleArray = JSON.parse(data);
//     // Get 'Excess Readmissions Ratio' for hospital
//     var ratioHospital = singleArray[0].readm_ratio;
//     var readmPercentHospital = (
//       singleArray[0].number_of_readmissions
//       / singleArray[0].number_of_discharges )
//       * 100;

//     console.log("Ratio:", ratioHospital);
//     console.log("num:", singleArray[0].number_of_readmissions, "den:", singleArray[0].number_of_discharges);
//     console.log("percent:", readmPercentHospital);
//   }
// })

// // Get Hospital data By Measure
//   // Array with CMS measures we query for in API
//   // KEY FOR ORDER IN CHART!!
//   var measureArray = ["READM-30-COPD-HRRP", "READM-30-HIP-KNEE-HRRP", "READM-30-AMI-HRRP", "READM-30-HF-HRRP", "READM-30-PN-HRRP"]
//   //Object ready for Measure ratios for hospital & benchmark
//   var ratioObjAll = {};
//   //Object ready for Measure readmission %  for hospital & benchmark
//   var readmissionObjAll = {};
//     request({
//       url: "https://data.medicare.gov/resource/kac9-a9fp.json",
//       qs: {
//         provider_id: 340039
//       }
//     }, function(error, response, data) {
//       if(!error && response.statusCode === 200) {
//         var singleArray = JSON.parse(data);
//         // Place holder arrays
//         var ratioHospitalArr = [];
//         var readmPercentHospitalArr = [];
//         // Get 'Excess Readmissions Ratio' for EACH Measure for hospital
//         measureArray.forEach(function(measure) {
//           for (var i = 0; i < singleArray.length; i++) {
//             if (singleArray[i].measure_id === measure) {
//               console.log("@Measure:", measure);
//               // Find and add excess ratio to ratioObjAll
//               ratioHospitalArr.push(singleArray[i].readm_ratio);
//               console.log("EACH-R:", singleArray[i].readm_ratio)
//               // Find and add readmission % to readmissionObjAll
//               var readmPercentHospital = (
//                 singleArray[i].number_of_readmissions
//                 / singleArray[i].number_of_discharges)
//                 * 100;
//                 console.log("EACH-P:", readmPercentHospital)
//               readmPercentHospitalArr.push(readmPercentHospital);
//             }
//           }
//         }); // end forEach(measure) - HOSPITAL
//         console.log("@R-array:", ratioHospitalArr);
//         console.log("@P-array", readmPercentHospitalArr);
//         // Add ratio and readmission percent arrays to main obj
//         ratioObjAll.hospital = ratioHospitalArr;
//         readmissionObjAll.hospital = readmPercentHospitalArr;
//         console.log("------------------------------------------------")
//       };
//     });

// // Get ALL hospitals data by Benchmark
//   request({
//     url: "https://data.medicare.gov/resource/kac9-a9fp.json",
//     qs: {
//       state: "RI"
//     }
//   }, function(error, response, data) {
//     if (!error && response.statusCode === 200) {
//       var dataArray = JSON.parse(data);
//       // Stores top and bottom ratio for ST
//       // Place holder arrays
//       var ratioTopBot = [];
//       var readmPercentHospitalArr = [];
//       // Get 'Excess Readmissions Ratio' for EACH measure for all hosptials in the ST
//       measureArray.forEach(function(measure) {

//       var ratioArray = [];
//       for (var i = 0; i < dataArray.length; i++) {
//         if ((dataArray[i].measure_id === measure)
//          && (dataArray[i].readm_ratio !== "Not Available")
//          && (dataArray[i].readm_ratio !== "Too Few to Report"))
//         {
//           console.log("@Measure-B:", measure);
//           ratioArray.push(dataArray[i].readm_ratio);
//           console.log("EACH-Bench-R:", dataArray[i].readm_ratio)
//         }
//         // Total readmissions and discharges for combined hostitals in the ST
//         if ((dataArray[i].measure_id === measure)
//          && (dataArray[i].number_of_readmissions !== "Not Available")
//          && (dataArray[i].number_of_readmissions !== "Too Few to Report")
//          && (dataArray[i].number_of_discharges !== "Not Available")
//          && (dataArray[i].number_of_discharges !== "Too Few to Report"))
//         {
//           var totalReadmins =+ dataArray[i].number_of_readmissions;
//           console.log("@number_of_readmissions:", dataArray[i].number_of_readmissions)
//           var totalDischarges =+ dataArray[i].number_of_discharges;
//           console.log("@number_of_discharges:", dataArray[i].number_of_discharges)
//         }
//       }
//       // Percent of readmissions out of discharges for the ST
//       var readminPercentbyST = (totalReadmins / totalDischarges) * 100;
//       console.log("@ReadmBySt", readminPercentbyST)
//       readmPercentHospitalArr.push(readminPercentbyST);
//       // Sort and store only top and bottom 'Excess Readmissions Ratio'
//       ratioArray = ratioArray.sort(function(a, b) { return a - b });
//       var sortedArray = [];
//       sortedArray.push(ratioArray[0], ratioArray[ratioArray.length - 1]);
//       ratioTopBot.push(sortedArray);
//       console.log("@TopBot", ratioTopBot);
//       }); // End forEach(measure) - Benchmarks
//       // Add ratio and readmission percent arrays to main obj
//       ratioObjAll.benchmark = ratioTopBot;
//       readmissionObjAll.benchmark = readmPercentHospitalArr;
//       console.log("@ratioObjAll:", ratioObjAll);
//       console.log("@readmissionObjAll:", readmissionObjAll);
//     // View report - redirect to dashboard
//     // res.redirect("/dashboard");
//     }
//   });

  // COPD Test:
  // request({
  //   url: "https://data.medicare.gov/resource/kac9-a9fp.json",
  //   qs: {
  //     measure_id: "READM-30-COPD-HRRP"
  //   }
  // }, function(error, response, data) {
  //   console.log("@COPD@", data);
  // })
 console.log(session);
