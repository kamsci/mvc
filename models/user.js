'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Invalid Email Address"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 254],
          msg: "Password must be between 8 and 254 cahracters"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [2, 254],
          msg: "Name must be between 2 and 254 characters"
        }
      }
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};
