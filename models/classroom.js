'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Classroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Staff } = models;

      Classroom.hasMany(Staff, { foreignKey: 'classroom', as: 'Teachers' });
    }
  };
  Classroom.init({
    cycle: { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'Classroom',
    tableName: 'classrooms'
  });
  return Classroom;
};