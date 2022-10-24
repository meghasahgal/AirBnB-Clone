'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert(
		"Spots",
		[
			{
				userId: 1,
				address: "246 Hashed Password Way",
				city: "New York",
				state: "NY",
				country: "United States",
				lat: 12.11133,
				lng: 64.55555,
				name: "Secluded mansion",
				description: "Tech forward respite",
				price: 299,
				avgRating: 4.8,
				previewImage:
					"https://images.unsplash.com/photo-1618990908950-fd1a23294d11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",
			},
			{
				userId: 2,
				address: "55 Apple Boulevard",
				city: "San Francisco",
				state: "CA",
				country: "United States",
				lat: 25.11133,
				lng: 87.55555,
				name: "Low Key Home",
				description: "Really nice and comfy home",
				price: 399,
				avgRating: 4.9,
				previewImage:
					"https://images.unsplash.com/photo-1601056645918-329b756e54fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2934&q=80",
			},
			{
				userId: 3,
				address: "888 CodingAlong Dr",
				city: "Chattanooga",
				state: "TN",
				country: "United States",
				lat: 25.33333,
				lng: 64.55555,
				name: "Country Getaway",
				description: "Cute chill country home",
				price: 199,
				avgRating: 4.9,
				previewImage:
					"https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
			},
		],
		{}
	);
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete('Spots', null, {});

  }
};
