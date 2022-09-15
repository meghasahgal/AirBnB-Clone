'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(models.Image, {foreignKey: 'reviewId'})
      Review.belongsTo(models.User,{foreignKey: 'userId'})
      Review.belongsTo(models.Spot,{foreignKey: 'spotId'})


    }
  }
  Review.init({
    url: DataTypes.STRING,
    review: DataTypes.STRING,
    stars: DataTypes.DECIMAL,
    imageId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};