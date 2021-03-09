'use strict';

const { query } = require("express");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('config', {
      id: { allowNull: false, type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING },
      registration: { type: Sequelize.STRING, unique: true },
      country: Sequelize.STRING,
      region: Sequelize.STRING,
      department: Sequelize.STRING,
      borough: Sequelize.STRING,
      city: Sequelize.STRING,
      postal_code: Sequelize.INTEGER,
      address: Sequelize.STRING,
      motto: Sequelize.STRING,
      chief: Sequelize.STRING,
      email: { type: Sequelize.STRING, unique: true },
      phone: { type: Sequelize.STRING, unique: true }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('config');
  }
};
