module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Categories',
      [
        { name: 'Action', color: 'Blue' },
        { name: 'Comedy', color: 'Orange' },
        { name: 'Drama', color: 'Aqua' },
        { name: 'Horror', color: 'Gray' },
        { name: 'Show', color: 'Green' },
        { name: 'Adversting', color: 'Red' },
        { name: 'Social', color: 'Violet' },
        { name: 'Children', color: 'Light blue' },
        { name: 'Classic', color: 'Yellow' },
        { name: 'Sport', color: 'Lawngreen' },
        { name: 'Phones', color: 'Pink' },
        { name: 'Clothing', color: 'Indianred' },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  },
};
