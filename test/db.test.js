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
    });
    console.log("Array: ", hospitalArray.sort());
  });
// 2. find all datasets associated to a user

///// OLDER FOR REFERENCE ///////

//find USER and create PROVIDER and BENCHMARK and JOINS
// db.user.find({
//   where: { id: 1 },
//   include: [db.provider]
// })
// .then(function(user) {
//   user.createProvider({
//     providerId: 390150,
//     providerName: "WASHINGTON HEALTH SYSTEM GREENE",
//     city: "WAYNESBURG",
//     state: "PA",
//     hospitalType: "Acute Care Hospitals",
//     hospitalOwnership: "Proprietary",
//     emergencyService: true
//   })
//   .then(function(provider) {
//     provider.createBenchmark({
//       nationOrState: provider.state,
//     });
//   });
// });

// 2. find user and find or create PROVDER BENCHMARK and JOINS
// db.user.find({
//   where: { id: 6 },
//   include: [db.provider]
// })
// .then(function(user) {
//   db.provider.findOrCreate( {
//     where: { providerId: 390150 },
//     defaults: {
//       providerName: "WASHINGTON HEALTH SYSTEM GREENE",
//       city: "WAYNESBURG",
//       state: "PA",
//       hospitalType: "Acute Care Hospitals",
//       hospitalOwnership: "Proprietary",
//       emergencyService: true
//     }
//   })
//   .spread(function(provider, created) {
//     user.addProvider(provider);
//     var prov = provider;
//     db.provider.find({
//       where: { id: prov.providerId },
//     })
//     .then(function(provider2) {
//       db.benchmark.findOrCreate({
//         where: { }
//       defaults: {
//         nationOrState: prov.state
//       }
//       })
//     })
//     // console.log(provider.providerId);
//   })
// })
// .catch(function(error) {
//   // console.log("Error: Find or Create userProdiverBenchmark");
//   // req.flash("Error", "User does not have a dataset");
// });

// QUERY TESTS
// 1. finding a USER and getting all related BENCHMARKS
// db.user.find({
//   where: { id: 1 },
//   include: [db.provider]
// }).then(function(user) {
//   var provider = user.providers[0].usersProviders.dataValues.providerId;
//   db.providersBenchmarks.find({
//     where: { providerId: provider }
//   }).then(function(providerBenchmark) {
//     var benchmark = providerBenchmark.benchmarkId;
//     db.benchmark.find({
//       where: { id: benchmark }
//     }).then(function(benchmark) {
//       console.log(benchmark.get());
//     });
//     console.log(providerBenchmark.get());
//   });
//   console.log(user.get());
// });

// 2. finding a USER and getting all related PROVIDERS and BENCHMARKS
// db.usersProviders.find({
//   where: { userId: 1 },
//   // include: [db.provider]
// })
// .then(function(userProvider) {
//   db.provider.find({
//     where: { id: userProvider.providerId }
//   })
//   .then(function(provider) {
//     // console.log(provider.get());
//     // console.log(provider.providers[0].usersProviders.dataValues);
//     var prov = provider.id;
//     db.providersBenchmarks.find({
//       where: { providerId: prov }
//     })
//     .then(function(providerBenchmark) {
//       var bench = providerBenchmark.benchmarkId;
//       db.benchmark.find({
//         where: { id: bench }
//       }).then(function(benchmark) {
//         console.log(benchmark.get());
//       });
//       // console.log(providerBenchmark.get());
//     });
//     console.log(provider.get());
//   });
//   // console.log(userProvider.get());
// })
// .catch(function(error) {
//   console.log("Error: userProviderBenchmark");
// });
// // Option 2 create
// // creating the M:M association manually
// // sequelize does this for you if you create with option 1 above

// db.postTags.create({
//   postId: 1,
//   tagId: 1
// }).then(function(taco) {
//   console.log(taco.get());
// });
