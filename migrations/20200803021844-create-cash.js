'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cashes', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: Sequelize.STRING,
      level: Sequelize.JSON,
      cycle: Sequelize.STRING,
      amount: Sequelize.INTEGER,
      delay: Sequelize.DATE,
      mandatory: Sequelize.BOOLEAN,
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cashes');
  }
};