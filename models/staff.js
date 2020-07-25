'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Staff.init({
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: DataTypes.STRING,
    birthdate: { type: DataTypes.DATE, allowNull: false },
    birthplace: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    avatar: DataTypes.STRING,
    type: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'Staff',
    tableName: 'staff',
  });

  return Staff;
};