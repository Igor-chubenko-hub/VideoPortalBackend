'use strict';
module.exports = (sequelize, DataTypes) => {
  const Interested = sequelize.define('Interested', {
    email: DataTypes.STRING
  }, {});
  Interested.associate = function(models) {
    // associations can be defined here
  };
  return Interested;
};