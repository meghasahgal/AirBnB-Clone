'use strict';
const bcrypt = require('bcryptjs');
const {Model, Validator} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    toSafeObject() { //Method that the API routes for authentication will use to interact with the Users table; This method will return an object with only the User instance information that is safe to save to a JWT, like id, username, and email.
      const { id, username, email, firstName, lastName } = this; // context will be the User instance
      return { id, username, email, firstName, lastName};
    }

     validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

     static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }

    //login
     static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }
      //signup
      static async signup({ username, email, password, firstName, lastName }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName
      });
      return await User.scope('currentUser').findByPk(user.id);
    }




    static associate(models) {
      // define association here
    }
  };

   User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
       firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 40],
        }
      },
      lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          len: [3, 40],
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
       },


     },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword"] }
        },
        loginUser: {
          attributes: {}
        }
      }
    }
  );
  return User;
};
