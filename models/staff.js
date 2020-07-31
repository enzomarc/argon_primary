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
      const { Classroom } = models;

      Staff.belongsTo(Classroom, { foreignKey: 'classroom', as: 'Classroom' });
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
    type: { type: DataTypes.STRING, allowNull: false },
    classroom: { type: DataTypes.INTEGER }
  }, {
    sequelize,
    modelName: 'Staff',
    tableName: 'staff',
  });

  return Staff;
};