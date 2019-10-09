module.exports = (sequelize, DataTypes) => {
  const Videos = sequelize.define(
    'Videos',
    {
      title: DataTypes.STRING,
      owner: DataTypes.STRING,
      description: DataTypes.STRING,
      videoLink: DataTypes.STRING,
      duration: DataTypes.REAL,
      status: DataTypes.STRING,
      updatedAt: DataTypes.DATE,
    },
    {}
  );
  Videos.associate = function(models) {
    Videos.belongsToMany(models.Categories, {
      through: models.VideosCategories,
      as: 'categories',
      foreignKey: 'videoId',
    }),
      Videos.belongsTo(models.Users, {
        as: 'author',
        foreignKey: 'owner',
      });
  };
  return Videos;
};
