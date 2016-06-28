var db = require("./models")
var request = require("request");

// Populate all hospital data from api to the HOSPITAL database
  request({
    url: "https://data.medicare.gov/resource/rbry-mqwu.json"
  }, function(error, response, data) {
      var dataArray = JSON.parse(data);
      if (!error && response.statusCode === 200) {
        // console.log("dataArray: ", dataArray);
        // console.log("obj: ", dataArray[0]);
        dataArray.forEach(function(hospitalObj) {
          db.hospital.findOrCreate({
            where: { provider_id: hospitalObj.provider_id},
            defaults: {
              hospital_name: hospitalObj.hospital_name,
              city: hospitalObj.city,
              state: hospitalObj.state,
              hospital_type: hospitalObj.hospital_type,
              hospital_ownership: hospitalObj.hospital_ownership,
              emergency_services: hospitalObj.emergency_services
            }
          }).spread(function(hospital, created) {
            console.log("Hospitals Database Updated");
          });
        });
      }
  });

  // PHASE 2 - Removes hospitals without data from HOSPITAL database
  // request({
  //   url: "https://data.medicare.gov/resource/kac9-a9fp.json"
  // }, function(error, response, data){
  //   var dataArr = JSON.parse(data);
  //   if (!error && response.statusCode === 200) {
  //     dataArr.forEach(function(hosObj) {
  //       db.hospital.destroy({
  //         where: { }
  //       })
  //     })
  //   }
  // })
