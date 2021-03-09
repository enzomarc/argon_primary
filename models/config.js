'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Config extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  Config.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING },
    registration: { type: DataTypes.STRING, unique: true },
    country: DataTypes.STRING,
    region: DataTypes.STRING,
    department: DataTypes.STRING,
    borough: DataTypes.STRING,
    city: DataTypes.STRING,
    postal_code: DataTypes.INTEGER,
    address: DataTypes.STRING,
    motto: DataTypes.STRING,
    chief: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING, unique: true }
  }, {
    sequelize,
    modelName: 'Config',
    tableName: 'config',
    timestamps: false,
  });

  return Config;
};