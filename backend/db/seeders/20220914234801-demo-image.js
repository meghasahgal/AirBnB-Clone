'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Images', [
     {
        spotId:  1,
        reviewId: 1,
        url: faker.internet.url(),
        preview: true,

      },

     {
        spotId:  2,
        reviewId: 2,
        url: faker.internet.url(),
        preview: true,
     },

      {
        spotId:  3,
        reviewId: 3,
        url: faker.internet.url(),
        preview: true,
     },

    ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Images', null, {});


  }
};
