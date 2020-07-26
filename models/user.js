'use strict';
const {
  Model
} = require('sequelize');
const db = require('./index');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Staff } = models;

      User.Staff = User.belongsTo(Staff, { foreignKey: 'staff' });
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  };
  User.init({
    staff: { type: DataTypes.INTEGER, unique: true, allowNull: false },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });

  User.beforeCreate('hashPassword', (user) => {
    const salt = bcrypt.genSaltSync(12);
    user.password = bcrypt.hashSync(user.password, salt);
  });

  return User;
};

