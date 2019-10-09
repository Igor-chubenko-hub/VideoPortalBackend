module.exports = (sequelize, DataTypes) => {
  const VideosCategories = sequelize.define(
    'VideosCategories',
    {
      categoryId: DataTypes.INTEGER,
      videoId: DataTypes.INTEGER,
    },
    {}
  );
  VideosCategories.associate = function(models) {};
  return VideosCategories;
};
