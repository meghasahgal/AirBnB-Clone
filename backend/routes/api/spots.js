const express = require("express");

const router = express.Router();

const { Spot, Booking, Image, Review, User, sequelize } = require("../../db/models")

//auth middleware
const { requireAuth, restoreUser } = require("../../utils/auth");
const { Op } = require("sequelize");

//validation
const {validateSignup,validateSignin,validateSpot,validateReview,validateBooking, handleValidationErrors} = require("../../utils/validation")

//login middleware
//const { validateLogin } = require("./session")

//get all spots - done
router.get('/', async(req, res, next)=>{
    const allSpots = await Spot.findAll()
    return res.json(allSpots)
})

//get all spots owned by the current user --done
router.get('/current',restoreUser,requireAuth, async(req, res)=>{
    const userId = req.user.id
    //console.log(req.user)
    const spots = await Spot.findAll({
        where:{
            userId
        }
    })
    return res.json(spots)
})

//get details of a spot from an id - need to refactor to add scope to exclude password on user
router.get('/:spotId', async(req, res, next)=>{

    const spot = await Spot.findByPk(req.params.spotId,{
        attributes: {
            include:[
             [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'numReviews'],
             [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating'],
             ]
        },
        include: [
            {model: Image, as: 'SpotImages', attributes: {exclude: ['spotId', 'reviewId', 'createdAt', 'updatedAt']}},
            {model: User, as: 'Owner', attributes: {exclude: ['email', 'username', 'createdAt', 'updatedAt', 'hashedPassword']} },
            {model: Review, attributes: {exclude: ['id', 'review', 'stars', 'userId', 'spotId', 'createdAt', 'updatedAt']}}
        ]
    });

    if(!spot){
        res.status(404);
        res.json({
        message: "Spot couldn't be found",
    	statusCode: 404
        })
    }
 return res.json(spot)
})



//create a spot --need to add validation error
router.post('/',requireAuth, restoreUser, async(req, res, next)=>{
    const userId = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const newSpot = await Spot.create({
        userId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(201),
    res.json({
      newSpot
    })
})

//edit a spot - add validation error
router.put('/:spotId', requireAuth, restoreUser, async(req, res)=>{
    const userId = req.user.id;
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    //const spot = await Spot.findByPk(spotId)
    const spot = await Spot.findByPk(spotId,{
        attributes: ['id', 'userId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price','createdAt', 'updatedAt']
    })

    //error if no spot found
    if(!spot){
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,
            })
    }
    //error if body validation error - need to add
    let updatedSpot = await spot.update({
        userId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description
    })

    res.json(updatedSpot)

})


//delete a spot by id - done
router.delete('/:spotId', requireAuth, restoreUser, async(req,res)=>{
    const userId = req.user.id;
    const { spotId }  = req.params;
    const deletedSpot = await Spot.findByPk(spotId,{
        where:{
            userId:userId
        }
    })

    if(!deletedSpot){
        res.json({
            message: "Spot couldn't be found",
	        statusCode: 404
        })
    }

    await deletedSpot.destroy()
    res.json({
         message: "Successfully deleted",
         statusCode: 200
    })
})



//Add an Image to a Spot based on the Spot's id - done
router.post('/:spotId/images',requireAuth, restoreUser, async(req, res)=>{
    const {url, previewImage} = req.body;
    const { spotId } = req.params;
    const userId = req.user.id

    const spot = await Spot.findByPk(spotId,{
        where:{
            userId: userId
        }
    })

    // //error if no spot found
       if(!spot){
        res.json({
            message: "Spot couldn't be found",
	        statusCode: 404
        })
    }
    //add image
    const newImage = await spot.createSpotImage({
        spotId,
        url,
        preview: previewImage
    })

    //create payload for desired output
    const payload = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }

    return res.json(payload)

})

//Get all Reviews by a Spot's id - need to rename Image to ReviewImages via associations
router.get('/:spotId/reviews',async(req, res)=>{
    const { spotId } = req.params
    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {model: User, attributes: {exclude: ['email', 'username', 'createdAt', 'updatedAt', 'hashedPassword']}},
            {model: Image,as:'ReviewImages',attributes: {include: ['id', 'url']}},
                ]
     })
     return res.json(reviews)
    })


//Create a review based on Spot's id - done
router.post('/:spotId/reviews',requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const { review, stars } = req.body;
    const { spotId } = req.params;

    //find spot
    const spot = await Spot.findByPk(spotId)

    //if no spot found, return error
    if(!spot){
    res.json({
            message: "Spot couldn't be found",
	        statusCode: 404
        })
    }
    //check if current user has an existing review for that spot
    const hasExistingReview = await Review.findByPk(spotId,{
        where: {
            userId: userId
        }
    })
    //if user has an existing review, return an error

    if(hasExistingReview){
        res.json({
            message: "User already has a review for this spot",
            statusCode: 403
        })
    }
    //else create a new review
    const newReview = await Review.create({
        spotId,
        userId,
        review,
        stars
    })
    res.status(201),
    res.json({
      newReview
    })
})


//Create a Booking from a Spot based on the Spot's id
//Spot must NOT belong to the current user
/*
get spot
*/
router.post('/:spotId/bookings', requireAuth, restoreUser, validateBooking, async(req, res)=>{
    const userId  = req.user.id
    const { startDate, endDate } = req.body;
    const { spotId } = req.params;

    //find spot
    const spot = await Spot.findByPk(spotId,
       {

        where: {
            id: spotId,
            //user id !=== to logged in user
            userId: {
                [Op.ne]: req.user.id
            }
        }
    });
    console.log(spot, "spot")

    // console.log(spot.userId, "spotuserId")
    // console.log(userId, "userId")
    //if no spot found
    if(!spot){
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    //if booking exists for specific date, return error
    const booking = await Booking.findOne({
        where:{
            spotId: spotId,
            endDate: endDate,
            startDate :startDate,
        },
    })

    //console.log(booking, 'booking')

    //
    if(booking){
        res.json({
        message: "Sorry, this spot is already booked for the specified dates",
    	statusCode: 403,
    	errors: {
    		"startDate": "Start date conflicts with an existing booking",
    		"endDate": "End date conflicts with an existing booking"
        }})
    }

    //if spot doesn't belong to current user, create a new booking
    //  if(spot.userId !== req.user.id) {

        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate,
        })

        console.log(newBooking, "newBooking")
        res.status(200),
        res.json(newBooking)
    //  }
})



// Get all Bookings for a Spot based on the Spot's id - done, need to check order of model output
router.get('/:spotId/bookings', requireAuth, async(req, res)=>{
    const userId  = req.user.id
    const spotId = req.params.spotId
    //find spot
    const spot = await Spot.findByPk(spotId);
    //if no spot found
      if(!spot){
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    //if you are not the owner of the spot
    console.log(spot, "spot")
    if(spot.userId !== req.user.id){
        const ownedBookings = await Booking.findByPk(spotId, {
            attributes: ['spotId', 'startDate', 'endDate']
        })
        res.json(ownedBookings)
    }
    //if you are the owner
    else {
        const bookings = await Booking.findAll({
            attributes: {exclude: ['totalPrice']},
            // order: [Users, Bookings],
            where: {
                spotId: spotId
            },
            include: {
                model: User, attributes: {exclude: ['email', 'username', 'createdAt', 'updatedAt', 'hashedPassword']}
            }
        })
        res.json(bookings)
    }

})




module.exports = router;
