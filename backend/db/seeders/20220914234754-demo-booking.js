'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Bookings', [
     {
        spotId: 1,
        userId: 1,
        startDate: '2022-10-10',
        endDate: '2022-10-12',
        totalPrice: 304.50
      },

     {
        spotId: 2,
        userId: 2,
        startDate: '2022-10-10',
        endDate: '2022-10-12',
        totalPrice: 404.50
     },

      {
        spotId: 3,
        userId: 3,
        startDate: '2022-10-10',
        endDate: '2022-10-12',
        totalPrice: 204.50
     },

    ], {})
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete('Bookings', null, {});


  }
};
