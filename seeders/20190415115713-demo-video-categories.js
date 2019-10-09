module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'VideosCategories',
      [
        { videoId: 1, categoryId: 1 },
        { videoId: 2, categoryId: 1 },
        { videoId: 3, categoryId: 1 },
        { videoId: 4, categoryId: 1 },
        { videoId: 5, categoryId: 1 },
        { videoId: 6, categoryId: 1 },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('VideosCategories', null, {});
  },
};
