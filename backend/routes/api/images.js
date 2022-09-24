const express = require("express");

const router = express.Router();

const { Spot, Booking, Image, Review, User, sequelize } = require("../../db/models")

//auth middleware
const { requireAuth, restoreUser } = require("../../utils/auth");
const { Op } = require("sequelize");

//validation
const {validateSignup,validateSignin,validateSpot,validateReview,validateBooking, handleValidationErrors} = require("../../utils/validation")


// Delete a Review Image
router.delete('/:reviewImageId', requireAuth, restoreUser, async(req, res)=>{
    //const userId = req.user.id;
    const {reviewImageId} = req.params;
    //find image
    const image = await Image.findByPk(reviewImageId);
    console.log(image)
    // console.log(userId, 'userId')

    // check to see if image exists
    if(!image){
        res.status(404).json({
            message: "Review Image couldn't be found",
	        statusCode: 404
        })
    }

	//check to see if the review belongs to the current user
    // const review = await Review.findOne({
    //     where:{
    //             id: reviewImageId
    //     }})

	// if (review.userId !== req.user.id) {

	// 	return res.status(403).json({
	// 		message: "Forbidden",
	// 		statusCode: 403,
	// 	});
	// }

    //else, delete
	await image.destroy();
	res.status(200).json({
		message: "Successfully deleted",
		statusCode: 200,
	});
});




module.exports = router;
