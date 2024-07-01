'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // uses .belongsTo and defines foreignKey
      this.belongsTo(models.User, {
        foreignKey: {
          fieldName: "userId", 
          allowNull: false,
        }
      });
    }
  }

  // Initializes the attributes and options for the Course model of title, description, time, and materials needed
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Providing a title is required!"
        },
        notEmpty: {
          msg: "Please insert a title!"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Providing a description is required!"
        },
        notEmpty: {
          msg: "Please insert a description!"
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize, // passes sequelize instance
    modelName: 'Course',
  });
  return Course;
};