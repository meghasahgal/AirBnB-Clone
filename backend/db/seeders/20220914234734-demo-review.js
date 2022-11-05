'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert(
		"Reviews",
		[
			{
				review: "Awesome place to stay!",
				stars: 4.5,
				userId: 2,
				spotId: 1,
			},

			{
				review:
					"We had a lovely time taking in the sites of the city!",
				stars: 4.8,
				userId: 3,
				spotId: 2,
			},

			{
				review: "Cute and comfy!",
				stars: 4.9,
				userId: 1,
				spotId: 3,
			},
			{
				review: "What more could you ask for with a beautiful ocean view?!",
				stars: 4.9,
				userId: 2,
				spotId: 4,
			},
			{
				review: "Stay here if you really love living locally. The food was amazing!",
				stars: 4.9,
				userId: 3,
				spotId: 5,
			},
			{
				review: "Amazing place for some much needed peace and quiet!",
				stars: 4.9,
				userId: 1,
				spotId: 6,
			},
		],
		{}
	);
  },


  async down (queryInterface, Sequelize) {

  await queryInterface.bulkDelete('Reviews', null, {});

  }
};
