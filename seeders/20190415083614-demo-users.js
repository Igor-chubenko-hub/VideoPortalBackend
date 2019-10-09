module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'John',
          email: 'qwe@qwe.qwe',
          password:
            '$2b$07$0IXSY4/ymJ98UgmdE4PqvumHSDw3IZUvF0SJGDjmGCIOqPgflw0ae',
          country: 'Azerbaijan',
          city: 'Baki',
          avatar: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
