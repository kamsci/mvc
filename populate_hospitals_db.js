var db = require("./models")
var request = require("request");

// Populate all hospital data from api to the HOSPITAL database
  request({
    url: "https://data.medicare.gov/resource/rbry-mqwu.json"
  }, function(error, response, data) {
      var dataArray = JSON.parse(data);
      if (!error && response.statusCode === 200) {
        dataArray.forEach(function(hospitalObj) {
          if ((hospitalObj.readm_ratio !== "Not Available")
             && (hospitalObj.readm_ratio !== "Too Few to Report")) {
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
            });
          }
        });
      }
  });
