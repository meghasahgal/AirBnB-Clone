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

//Add Query Filters to Get All Spots
//optional: query parameters not having to be included when making requests to the given route
router.get('/', async(req, res, next)=>{
    let {page, size, minLat,maxLat, minLng,maxLng, minPrice, maxPrice} = req.query;

    //We want to be able to get all spots if no query params are passed
    let limit;
    let offset;
    //parse for the integers
    page = parseInt(page);
    size = parseInt(size);
    //if no page and size
    if(!page && !size){
        const allSpots= await Spot.findAll()
        return res.json(allSpots)
    }

    // //establish defaults for page and size
    // if(Number.isNaN(page)) page = 0;
    // if(Number.isNaN(size)) size = 20;

    // //and we want the query params to be respected if they are passed in.
    if(page >=1 && size >=1){
        limit = size,
        offset = size * (page -1)
    }

    const filteredSpots = await Spot.findAll({
            limit: size,
            offset: size * (page -1)
    });

    return res.json({
        filteredSpots, page, size
    })

})



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
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId,{
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
        ],
        group: ['Spot.id']
    });


    if(!spot || spot.id === null){
        res.status(404);
        res.json({
        message: "Spot couldn't be found",
    	statusCode: 404
        })
    }
 return res.json(spot)
})



//create a spot --need to add validation error, added payload
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
    });
    const payload = {
        id: newSpot.id,
        userId: newSpot.userId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt,
    }
    res.status(201),
    res.json(payload)
    // res.json({
    //   newSpot
    // })
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
        description,
        price
    })

    res.json(updatedSpot)

})


//delete a spot by id - done
router.delete('/:spotId', requireAuth, restoreUser, async(req,res)=>{
    const userId = req.user.id;
    const { spotId }  = req.params;
    const deletedSpot = await Spot.findByPk(spotId)
        //{
        // where:{
        //     userId:userId
        // }
    // })

    if(!deletedSpot){
        res.json({
            message: "Spot couldn't be found",
	        statusCode: 404
        })
    }
    //check if spot belongs to current user
    if(deletedSpot.userId !== req.user.id){
        res.statusCode = 403;
		return res.json({
			message: "Forbidden",
			statusCode: res.statusCode,
		});
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

//Get all Reviews by a Spot's id -
router.get('/:spotId/reviews',async(req, res)=>{
    const { spotId } = req.params

    const spot = await Spot.findByPk(spotId)
    //if no spot found, return
    if(!spot){
        res.json({
             message: "Spot couldn't be found",
	         statusCode: 404
    })
    }
    //else find all of the reviews where the spot ids are equivalent
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


//Create a review based on Spot's id
router.post('/:spotId/reviews',requireAuth, validateReview, async(req, res, next)=>{
     const {spotId} = req.params
     const userId = req.user.id
     const {review,stars} = req.body
    //see if there's an existing review, need to add current user check - done
    const existingReview = await Review.findOne({
        where:{
            spotId: spotId,
            userId: req.user.id
        }})
    //get the spot
    const spot = await Spot.findOne({
        include:{
            model: Review
        },
        where:{
            id:spotId,
            //userId: req.user.id
        }
    })
     //error handling for an existing review
    if(existingReview){
        res.json({
             message: "User already has a review for this spot",
             statusCode: 403
        })
    next(err)
    //check if spot exists
    }else if(!spot){
        res.json({
            message: "Spot couldn't be found",
 	        statusCode: 404

    })}
    else{ //add new review

    const newReview = await spot.createReview({
        userId,
        spotId,
        review,
        stars

    })
    res.status(201),
    res.json(newReview)
}
})


// Get all Bookings for a Spot based on the Spot's id - done
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
    // console.log(spot, "spot")
    if(spot.userId !== req.user.id){
        const notOwnedBookings = await Booking.findByPk(spotId, {
            attributes: ['spotId', 'startDate', 'endDate']
        })
        res.status(200),
        res.json(notOwnedBookings)
        // console.log(notOwnedBookings)
    }
    //if you are the owner
    else if(spot.userId === req.user.id) {
        const ownedBookings = await Booking.findAll({
            attributes: {exclude: ['totalPrice']},
            // order: [Users, Bookings],
            where: {
                spotId: spotId
            },
            include: {
                model: User, attributes: {exclude: ['email', 'username', 'createdAt', 'updatedAt', 'hashedPassword']}
            }
        })
        res.status(200),
        res.json(ownedBookings)
    }

})

//Create a Booking from a Spot based on the Spot's id - need to, add validation errors and check again to see if owner/userid is the same in the bookings table
//Spot must NOT belong to the current user

//Create a Booking from a Spot based on the Spot's id - need to, add validation errors and check again to see if owner/userid is the same in the bookings table
//Spot must NOT belong to the current user

router.post('/:spotIdForBooking/bookings', validateBooking, requireAuth, restoreUser, async(req, res)=>{
    const userId = req.user.id
    const { startDate, endDate } = req.body;
    const { spotIdForBooking } = req.params;

//find spot
const spot = await Spot.findByPk(spotIdForBooking);
//console.log(spot)
//if no spot found
    if(!spot){
    res.json({
    message: "Spot couldn't be found",
    statusCode: 404
    })
    }
// console.log(spot)
// console.log(spot.userId),
// console.log(req.user.id)
//if spot belongs to current user, throw error
    if(spot.userId === req.user.id){
    res.json({
    message: "Spot can't belong to the current user",
    statusCode: 401
    })
    }

//if booking exists for specific date, return error via validateBooking; if not, find it
const booking = await Booking.findOne({
    where:{
        spotId: spotIdForBooking,
        startDate: startDate,
        endDate: endDate,
    },
    })
//console.log(booking)
//if booking exists for requested dates, throw error
if(booking){
    res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
    }})
}
//if all else doesn't hold true, create the booking
else {
const newBooking = await Booking.create({
    spotId: spotIdForBooking,
    userId,
    startDate,
    endDate,
})
//return booking
    res.status(200),
    res.json(newBooking)
}

//console.log(newBooking, "newBooking")
// }
})


// router.post('/:spotId/bookings', validateBooking, requireAuth, restoreUser, async(req, res)=>{
// const userId = req.user.id
// const { startDate, endDate } = req.body;
// const { spotId } = req.params;

// //find spot
// const spot = await Spot.findByPk(spotId,
// {
//     include: {
//         model: Booking},

//     where: {
//         id: spotId,
//         //user id !=== to logged in user
//         userId: {
//                 [Op.ne]: req.user.id
//                 }
//         }
//     });
//     //console.log(spot)
//     //if booking exists for specific date, return error
//     const booking = await Booking.findOne({
//     where:{
//         spotId: spotId,
//         endDate: endDate,
//         startDate: startDate,
//     },
//     })

//     //if no spot found
//     if(!spot){
//     res.json({
//         message: "Spot couldn't be found",
//         statusCode:404
//     })
//     }
//     // console.log(spot)

//     //
//     if(booking){
//     res.json({
//         message: "Sorry, this spot is already booked for the specified dates",
//         statusCode: 403,
//         errors: {
//         "startDate": "Start date conflicts with an existing booking",
//         "endDate": "End date conflicts with an existing booking"
//     }})
//     }

//     //if spot doesn't belong to current user, create a new booking
//     // if(spot.userId !== req.user.id)
//     else if (spot.userId !== req.user.id) {
//         const newBooking = await Booking.create({
//         spotId,
//         userId,startDate,
//         endDate,
//         })
//     //return booking
//         res.status(200),
//         res.json(newBooking)
//         }

//     //console.log(newBooking, "newBooking")
//     // }
//     })


//Delete a Spot Image
router.delete('/:spotId/images/:imageId', requireAuth, restoreUser, async(req, res)=>{
    const userId = req.user.id;
    const {spotId, imageId} = req.params;
    const spot = await Spot.findByPk(spotId)
	//check to see if the spot belongs to the current user
	if (spot.userId !== req.user.id) {
		res.statusCode = 403;
		return res.json({
			message: "Forbidden",
			statusCode: res.statusCode,
		});
	}
    // get spot image
    const spotImage = await Image.findbyPk(imageId, {
        where: {
            spotId: spot.id
        }
    })

    // check to see if spotImage exists
    if(!spotImage){
        res.json({
            message: "Spot Image couldn't be found",
	        statusCode: 404
        })
    }

    //else, delete
	await spotImage.destroy();
	res.json({
		message: "Successfully deleted",
		statusCode: 200,
	});
});







module.exports = router;
