module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    'Categories',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Categories.associate = function(models) {
    Categories.belongsToMany(models.Videos, {
      through: models.VideosCategories,
      as: 'videos',
      foreignKey: 'categoryId',
    });
  };
  return Categories;
};
