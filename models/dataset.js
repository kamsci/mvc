'use strict';
module.exports = function(sequelize, DataTypes) {
  var dataset = sequelize.define('dataset', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    hospitalId: DataTypes.INTEGER,
    benchmarkId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.dataset.belongsTo(models.user);
        models.dataset.belongsTo(models.hospital);
        models.dataset.belongsTo(models.benchmark);
      }
    }
  });
  return dataset;
};
