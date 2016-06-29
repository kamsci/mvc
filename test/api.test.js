var express = require("express");
var db = require("../models");
var request = require("request");

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

// Get Hospital data By Measure
  // Array with CMS measures we query for in API
  // KEY FOR ORDER IN CHART!!
  var measureArray = ["READM-30-COPD-HRR", "READM-30-HIP-KNEE-HRRP", "READM-30-AMI-HRRP", "READM-30-HF-HRRP", "READM-30-PN-HRRP"]
  //Object ready for Measure ratios for hospital & benchmark
  var ratioObjAll = {};
  //Object ready for Measure readmission %  for hospital & benchmark
  var readmissionObjAll = {};
    request({
      url: "https://data.medicare.gov/resource/kac9-a9fp.json",
      qs: {
        provider_id: 340039
      }
    }, function(error, response, data) {
      if(!error && response.statusCode === 200) {
        var singleArray = JSON.parse(data);
        console.log(singleArray);
        // Get 'Excess Readmissions Ratio' for EACH Measure for hospital
        var ratioHospitalArr = [];
        var readmPercentHospitalArr = [];
        var test = [];
        measureArray.forEach(function(measure) {
          for (var i = 0; i < singleArray.length; i++) {
            if (singleArray[i].measure_id === measure) {
              console.log("@Measure:", measure);
              test.push("a");
              // Find and add excess ratio to ratioObjAll
              ratioHospitalArr.push(singleArray[i].readm_ratio);
              console.log("EACH-R:", singleArray[i].readm_ratio)
              // Find and add readmission % to readmissionObjAll
              var readmPercentHospital = (
                singleArray[i].number_of_readmissions
                / singleArray[i].number_of_discharges)
                * 100;
                console.log("EACH-P:", readmPercentHospital)
              readmPercentHospitalArr.push(readmPercentHospital);
            }
          }
        }); // end forEach(measure) HOSPITAL
        console.log("@R-array:", ratioHospitalArr);
        console.log("@P-array", readmPercentHospitalArr);
        ratioObjAll.hospital = ratioHospitalArr;
        readmissionObjAll.hospital = readmPercentHospitalArr;
      };
      console.log("@RatioO:", ratioObjAll);
      console.log("@Readm:", readmissionObjAll);
    });
