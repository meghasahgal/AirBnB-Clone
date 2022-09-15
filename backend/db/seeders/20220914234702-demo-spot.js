'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Spots', [
      {
        userId: '1',
        address: '246 Hashed Password Way',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        lat: 12.11133,
        lng: 64.55555,
        name: 'Secluded mansion',
        description: 'Tech forward respite',
        price: 299,
        avgRating: 4.8,
        previewImage: 'wwww.techsavvyplace.com'
      },
      {
        userId: '2',
        address: '55 Apple Boulevard',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 25.11133,
        lng: 87.55555,
        name: 'Low Key Home',
        description: 'Really nice and comfy home',
        price: 399,
        avgRating: 4.9,
        previewImage: 'wwww.lowkeyhomeplace.com'
      },
      {
        userId: '3',
        address: '888 CodingAlong Dr',
        city: 'Chattanooga',
        state: 'TN',
        country: 'United States',
        lat: 25.33333,
        lng: 64.55555,
        name: 'Country Getaway',
        description: 'Cute chill country home',
        price: 199,
        avgRating: 4.9,
        previewImage: 'wwww.codingalongplace.com'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete('Spots', null, {});

  }
};
