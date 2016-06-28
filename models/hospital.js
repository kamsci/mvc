'use strict';
module.exports = function(sequelize, DataTypes) {
  var hospital = sequelize.define('hospital', {
    provider_id: DataTypes.INTEGER,
    hospital_name: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    hospital_type: DataTypes.STRING,
    hospital_ownership: DataTypes.STRING,
    emergency_services: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.hospital.hasMany(models.dataset);
      }
    }
  });
  return hospital;
};
