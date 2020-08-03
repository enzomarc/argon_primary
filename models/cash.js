'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cash extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Cash.init({
    name: DataTypes.STRING,
    level: DataTypes.JSON,
    cycle: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    delay: DataTypes.DATE,
    mandatory: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Cash',
    tableName: 'cashes',
  });
  return Cash;
};