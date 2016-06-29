var express = require("express");
var db = require("../models");
var request = require("request");
// Get hosital data
request({
  url: "https://data.medicare.gov/resource/kac9-a9fp.json",
  qs: {
    provider_id: 340039
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
  }
})
