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
    page = parseInt(page);    size = parseInt(size);
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
            include: {model: Image, as: 'SpotImages'},
            limit: size,
            offset: size * (page -1)
    });
    //set previewImage
    let spots = [];
    filteredSpots.forEach((spot)=>{
        spots.push(spot.toJSON())
    })

    spots.forEach((spot)=>{
        spot.SpotImages.forEach((image)=>{
        if (image.preview === true) {
            spot.previewImage = image.url;
        }
    });
    //if no preview image
    if (!spot.previewImage) {
        spot.previewImage = "There is no preview image for the spot yet.";
        }
        delete spot.SpotImages;
    })

    //return spots and pagination
    return res.status(200).json({
        spots, page, size
    })
})



//get all spots - done
router.get('/', async(req, res, next)=>{
    const allSpots = await Spot.findAll()
    return res.json(allSpots)
})

//get all spots owned by the current user
router.get('/current',restoreUser,requireAuth, async(req, res)=>{
    const userId = req.user.id
    //console.log(req.user)
    const spots = await Spot.findAll({
        where:{
            userId: req.user.id
        },
        attributes:['id','userId','address','city','state','country','lat','lng','name','description','price','previewImage','createdAt','updatedAt'],

        include: {model: Image, as: 'SpotImages'}
    })

    //add preview image
    let userSpots = [];
        spots.forEach((spot)=>{
        userSpots.push(spot.toJSON())
    })

    userSpots.forEach((spot)=>{
        spot.SpotImages.forEach((image)=>{
        if (image.preview === true) {
            spot.previewImage = image.url;
        }
    });
    //if no preview image
    if (!spot.previewImage) {
        spot.previewImage = "There is no preview image for the spot yet.";
        }
        delete spot.SpotImages;
    })
    return res.status(200).json(userSpots)
})

//get details of a spot from an id -
router.get('/:spotId', async(req, res, next)=>{
    const { spotId } = req.params;
    //find spot
    const spot = await Spot.findAll({
        where: {
            id: spotId
        },

        include: [
            {model: Image, as: 'SpotImages'},
            {model: User, as: 'Owner', attributes: {exclude: ['email', 'username', 'createdAt', 'updatedAt', 'hashedPassword']} },
            {model: Review, attributes: []}
        ],
        attributes: {
            include:[
             [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'numReviews'],
             [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating'],
             ],
        },
        group: ['Spot.id', 'Owner.id','SpotImages.id']
    });

    //if spot doesn't exist
    if(!spot || spot.id === null){

        res.status(404).json({
        message: "Spot couldn't be found",
    	statusCode: 404
        })
    }

    // push spot to an array as a .JSON obj
    let spotList = [];

    spot.forEach(item =>{
        spotList.push(item.toJSON()) // is an obj that we can manipulate, push to list; array of objs
    })
    //find and identify the item/spot and then iterate through the SpotImages array
        spotList.forEach(item =>{
            item.SpotImages.forEach(image =>{  // loop over Images array
                if(image.preview === true){
                    item.previewImage = image.url //set item/spot preview image to image.url if preview is true
                }
            });
            //if item/spot doesn't have a previw image, set the property
            if(!item.previewImage){
                item.previewImage ="There is no preview image for the spot yet."
            }

            //  if(!item.avgStarRating){
            //     item.avgStarRating ="There is no average rating for the spot yet."
            // }

        })
            res.status(200).json(spotList)

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
        return res.status(404).json({
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
        res.status(404).json({
            message: "Spot couldn't be found",
	        statusCode: 404
        })
    }
    //check if spot belongs to current user
    if(deletedSpot.userId !== req.user.id){

		return res.status(403).json({
			message: "Forbidden",
			statusCode: 403
		});
	}

    await deletedSpot.destroy()
    res.status(200).json({
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
            userId: req.user.id
        },
        include: {model: Image, as: 'SpotImages'} //added image model here
    })

    // //error if no spot found
       if(!spot){
        res.status(404).json({
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
        res.status(404).json({
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
        res.status(403).json({
             message: "User already has a review for this spot",
             statusCode: 403
        })
    next(err)
    //check if spot exists
    }else if(!spot){
        res.status(404).json({
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
    const {spotId} = req.params
    //find spot
    const spot = await Spot.findByPk(spotId);
    //if no spot found
      if(!spot){
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    console.log(spot, "spot")
    console.log(userId, 'userId')
    console.log(spotId, 'spotId')
    console.log(spot.userId, 'spotUserId')

    //if you are not the owner of the spot - works
    // console.log(spot, "spot")
    if(spot.userId !== req.user.id){
        const notOwnedBookings = await Booking.findByPk(spotId, {
            attributes: ['spotId', 'startDate', 'endDate']
        })
        res.status(200),
        res.json(notOwnedBookings)
        // console.log(notOwnedBookings)
    }
    //if you are the owner - fixed
    //else if(spot.userId === req.user.id) {
    else {
        const ownedBookings = await Booking.findAll({
            attributes: {exclude: ['totalPrice']},

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
    res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
    }
// console.log(spot)
// console.log(spot.userId),
// console.log(req.user.id)
//if spot belongs to current user, throw error
    if(spot.userId === req.user.id){
    res.status(401).json({
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
    res.status(403).json({
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


//Delete a Spot Image
router.delete('/:spotId/images/:imageId', requireAuth, restoreUser, async(req, res)=>{
    const userId = req.user.id;
    const {spotId, imageId} = req.params;
    const spot = await Spot.findByPk(spotId)
	//check to see if the spot belongs to the current user
	if (spot.userId !== req.user.id) {

		return res.status(403).json({
			message: "Forbidden",
			statusCode: 403,
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
        res.status(404).json({
            message: "Spot Image couldn't be found",
	        statusCode: 404
        })
    }

    //else, delete
	await spotImage.destroy();
	res.status(200).json({
		message: "Successfully deleted",
		statusCode: 200,
	});
});


module.exports = router;
