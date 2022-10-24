'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert(
		"Images",
		[
			{
				spotId: 1,
				reviewId: 1,
				url: "https://images.unsplash.com/photo-1618990908950-fd1a23294d11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",
				preview: true,
			},

			{
				spotId: 2,
				reviewId: 2,
				url: "https://images.unsplash.com/photo-1601056645918-329b756e54fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2934&q=80",
				preview: true,
			},

			{
				spotId: 3,
				reviewId: 3,
				url: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
				preview: true,
			},
		],
		{}
	);
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Images', null, {});


  }
};
