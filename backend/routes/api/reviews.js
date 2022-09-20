const express = require("express");

const router = express.Router();

const { Spot, Booking, Image, Review, User,sequelize } = require("../../db/models")

//auth middleware
const { requireAuth } = require("../../utils/auth");
const { restoreUser } = require("../../utils/auth");


//Get all Reviews of the Current User -make sure ReviewImages populates once image added
router.get('/current', requireAuth, restoreUser, async(req, res)=>{
    const userId = req.user.id
    //console.log(userId)
    const reviews = await Review.findAll({
        where: {
            userId: userId
        },
        include: [
            {model: User, attributes: {exclude: ['email', 'username', 'createdAt', 'updatedAt', 'hashedPassword']}},
            {model: Spot, attributes: {exclude: ['description', 'avgRating', 'createdAt', 'updatedAt']}},
            {model: Image, as:'ReviewImages', attributes: ['id', 'url']},
                ]
    })
    return res.json(reviews)
})

//Add an Image to a Review based on the Review's id - need  add condition for > 10 images
router.post('/:reviewId/images', requireAuth, restoreUser, async(req, res)=>{
    const userId = req.user.id
    const {url} = req.body
    //get review of current user
    const review = await Review.findByPk(req.params.reviewId, {
        where: {
            userId: userId
        }
    })

    //if review not found
    if(!review){
    res.json({
            message: "Review couldn't be found",
	        statusCode: 404
        })
    }

    //if review has > 10 images
    // const imageCountCheck =  await Review.findByPk(req.params.reviewId, {
    //     where: {
    //         userId: userId
    //     },
    //     attributes: {
    //     include:  [[sequelize.fn('COUNT', sequelize.col('ReviewImages.id')), 'numImages']]
    //     },
    //      include: [
    //         {model: Image, as: 'ReviewImages'}
    //      ]
    // })
    // console.log(imageCountCheck)
    // console.log(imageCountCheck.Review.numImages)


    //else, create new image for review
    const newImage = await review.createReviewImage({
            url
        });

    //create a payload for the new image
    const payload = {
        id: newImage.id,
        url: newImage.url

    }
        res.status(200),
        res.json(payload)

})

//Edit a Review - need to add body validation errors
router.put('/:reviewId', requireAuth, restoreUser, async(req,res)=>{
    const userId = req.user.id
    const {review, stars} = req.body;

    const reviewToUpdate = await Review.findByPk(req.params.reviewId, {
        where: {
            userId: userId
        }
    })
    //if review doesn't exist, return error
    if(!reviewToUpdate){
         res.json({
            message: "Review couldn't be found",
	        statusCode: 404
        })
    }

    let  updatedReview = await reviewToUpdate.update({
        review, stars
    })

    res.json(updatedReview)

})

//Delete a Review -- done -- check if works
router.delete('/:reviewId', requireAuth, restoreUser, async(req, res)=>{
    const userId = req.user.id
    const review = await Review.findByPk(req.params.reviewId, {
        where: {
            userId: userId
        }
    })
    console.log("review", review)

    if(!review){
          res.json({
            message: "Review couldn't be found",
	        statusCode: 404
        })
    }

    await review.destroy()
    res.json({
        message: "Successfully deleted",
    	statusCode: 200
    })
})

// Delete a Review Image
router.delete('/:reviewId/images/:imageId', requireAuth, restoreUser, async(req, res)=>{
    const userId = req.user.id;
    const {imageId, reviewId} = req.params;
    const review = await Review.findByPk(reviewId)
	//check to see if the review belongs to the current user
	if (review.userId !== req.user.id) {
		res.statusCode = 403;
		return res.json({
			message: "Forbidden",
			statusCode: res.statusCode,
		});
	}
    // get review image
    const reviewImage = await Image.findbyPk(imageId, {
        where: {
            reviewId: review.id
        }
    })

    // check to see if reviewImage exists
    if(!reviewImage){
        res.json({
            message: "Review Image couldn't be found",
	        statusCode: 404
        })
    }

    //else, delete
	await reviewImage.destroy();
	res.json({
		message: "Successfully deleted",
		statusCode: 200,
	});
});





module.exports = router;
