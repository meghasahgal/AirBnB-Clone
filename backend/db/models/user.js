'use strict';
const bcrypt = require('bcryptjs');
const {Model, Validator, Op} = require('sequelize');
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
    //   static async signup({ username, email, password, firstName, lastName }) {
    //   const hashedPassword = bcrypt.hashSync(password);
    //   const user = await User.create({
    //     username,
    //     email,
    //     password: hashedPassword,
    //     firstName,
    //     lastName
    //   });
    //   return await User.scope('currentUser').findByPk(user.id);
    // }

      static async signup({ username, email, password, firstName, lastName }){
      try{
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
        username,
        email,
        hashedPassword,
        firstName,
        lastName
      });

      return await User.scope('currentUser').findByPk(user.id);
      }
      //custom error 403 for duplicate user signups
      catch(e)
      {
        if(e.name === 'SequelizeUniqueConstraintError'){
          e.status = 403;
          e.message = 'User already exists'
        }

        if(!email || !username || !firstName || !lastName){
          e.status = 400;
        }
        throw e;
      }
    }

// catch(e) {
//     const messages = {};
//     if (e instanceof ValidationError) {
//         e.errors.forEach((error) => {
//             let message;
//             switch (error.validatorKey) {
//                 case 'isEmail':
//                     message = 'Please enter a valid email';
//                     break;
//                 case 'isDate':
//                     message = 'Please enter a valid date';
//                     break;
//                 case 'len':
//                     if (error.validatorArgs[0] === error.validatorArgs[1]) {
//                         message = 'Use ' + error.validatorArgs[0] + ' characters';
//                     } else {
//                         message = 'Use between ' + error.validatorArgs[0] + ' and ' + error.validatorArgs[1] + ' characters';
//                     }
//                     break;
//                 case 'min':
//                     message = 'Use a number greater or equal to ' + error.validatorArgs[0];
//                     break;
//                 case 'max':
//                     message = 'Use a number less or equal to ' + error.validatorArgs[0];
//                     break;
//                 case 'isInt':
//                     message = 'Please use an integer number';
//                     break;
//                 case 'is_null':
//                     message = 'Please complete this field';
//                     break;
//                 case 'not_unique':
//                     message = error.value + ' is taken. Please choose another one';
//                     error.path = error.path.replace("_UNIQUE", "");
//             }
//             messages[error.path] = message;
//         });
//     }
// }


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
          len: [60, 60],

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
