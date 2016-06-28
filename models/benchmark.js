'use strict';
module.exports = function(sequelize, DataTypes) {
  var benchmark = sequelize.define('benchmark', {
    name: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.benchmark.hasMany(models.dataset);
      }
    }
  });
  return benchmark;
};
