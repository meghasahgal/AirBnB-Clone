'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    Spot.hasMany(models.Image,{as: 'SpotImages',foreignKey: 'spotId', onDelete:'CASCADE', hooks:true})
    Spot.hasMany(models.Review,{foreignKey: 'spotId', onDelete:'CASCADE', hooks:true})
    Spot.hasMany(models.Booking,{foreignKey: 'spotId', onDelete:'CASCADE', hooks:true})
    Spot.belongsTo(models.User, {as: 'Owner', foreignKey: 'userId'})

    }
  }
  Spot.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    avgRating: DataTypes.DECIMAL,
    previewImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
