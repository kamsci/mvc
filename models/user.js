'use strict';

var bcrypt = require('bcrypt');

// //////////////////////////////

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid Email Address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 254],
          msg: 'Password must be between 8 and 254 characters'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [2, 254],
          msg: 'Name must be between 2 and 254 characters'
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.hasMany(models.dataset);
      }
    },
    instanceMethods: {
      validPassword: function(passwordPlain) {
        // return if the plain txt password matches the results of the hash
        return bcrypt.compareSync(passwordPlain, this.password);
      },
      toJSON: function() {
        // get and delete the hash from the object so it will not show in an api
        var jsonUser = this.get();
        delete jsonUser.password;
        return jsonUser;
      }
    },
    hooks: {
      beforeCreate: function(createdUser, options, cb) {
        // create and store the hash as the users password BEFORE creating in the DB
        var hash = bcrypt.hashSync(createdUser.password, 10);
        createdUser.password = hash;
        cb(null, createdUser);
      }
    }
  });
  return user;
};
