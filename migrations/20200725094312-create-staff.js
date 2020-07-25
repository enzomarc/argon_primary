'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('staff', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING },
      birthdate: { type: Sequelize.DATE, allowNull: false },
      birthplace: { type: Sequelize.STRING, allowNull: false },
      gender: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, unique: true, allowNull: false },
      email: { type: Sequelize.STRING, unique: true },
      avatar: Sequelize.STRING,
      type: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('staff');
  }
};