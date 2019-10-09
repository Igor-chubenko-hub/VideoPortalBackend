module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      avatar: DataTypes.STRING,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {}
  );
  Users.associate = function(models) {
    Users.hasMany(models.Videos, {
      as: 'videos',
      foreignKey: 'owner',
    });
  };
  return Users;
};
