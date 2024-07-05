'use strict';
const {Model} = require('sequelize');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs'); // hashes passwords
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // uses .hasMany and defines foreignKey
      this.hasMany(models.Course, {
        foreignKey: {
          fieldName: "userId",
          allowNull: false,
        }
      });
    }
  }
  // Initializes the attributes and options for the User model of first name, last name, email, and password
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "This email address is already in use!"
      },
        validate: {
          isEmail: {
            msg: "Please use a valid email adress!"
          }
        }
      },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set (val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue("password", hashedPassword);
      }
    }
  }, {
    sequelize, // passes sequelize instance
    modelName: 'User',
  });
  return User;
};