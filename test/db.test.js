var db = require("../models")
var request = require("request");

// CREATE TESTS
// 1. Create hospital
  // request({
  //   url: "https://data.medicare.gov/resource/rbry-mqwu.json",
  //   qs: { provider_id: 390150 }
  // }, function(error, response, data) {
  //     var dataObj = JSON.parse(data);
  //     if (!error && response.statusCode === 200) {
  //       // console.log("dataObj: ", dataObj);
  //       // console.log("objId: ", dataObj[0].provider_id);
  //       db.hospital.findOrCreate({
  //         where: { provider_id: 390150 },
  //         defaults: {
  //           hospital_name: dataObj[0].hospital_name,
  //           city: dataObj[0].city,
  //           state: dataObj[0].state,
  //           hospital_type: dataObj[0].hospital_type,
  //           hospital_ownership: dataObj[0].hospital_ownership,
  //           emergency_services: dataObj[0].emergency_services
  //         }
  //       }).spread(function(hospital, created) {
  //         console.log("Hospital should be in Database");
  //       })
  //     }
  // });


// QUERY TESTS
// 1. find all hospital names for select dropdown - Sort
  db.hospital.findAll()
  .then(function(hospitals) {
    hospitalArray = [];
    hospitals.forEach(function(hos) {
      var item = (hos.hospital_name + " - " + hos.provider_id);
      hospitalArray.push(item);
      hospitalSort = hospitalArray.sort()
    });
    console.log("@SORT: ", hospitalSort);
  });

//   db.hospital.findAll()
// .then(function(hos) {
//   var keys = Object.keys(hos);
//   console.log(keys);
// })



