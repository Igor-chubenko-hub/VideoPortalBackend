module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      owner: {
        allowNull: true,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      description: {
        type: Sequelize.STRING,
      },
      videoLink: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true,
      },
      duration: {
        allowNull: false,
        type: Sequelize.REAL,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isIn: [['uploaded', 'published']],
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Videos'),
};
