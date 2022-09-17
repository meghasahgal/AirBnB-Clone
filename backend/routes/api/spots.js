const express = require("express");

const router = express.Router();

const { Spot, Booking, Image, Review, User, sequelize } = require("../../db/models")

//auth middleware
const { requireAuth, restoreUser } = require("../../utils/auth");


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
    console.log(req.params.spotId)
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
router.put('/:spotId', requireAuth, async(req, res)=>{
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
    const deletedSpot = await Spot.findByPk(spotId)

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



//Add an Image to a Spot based on the Spot's id -
router.post('/:spotId/images',requireAuth, async(req, res)=>{
    const {url, previewImage} = req.body;
    const { spotId } = req.params;

    //const spot = await Spot.findByPk(spotId)
    const spot = await Spot.findByPk(spotId)
    //     {
    // include:
    //      [{model: Image, as: 'SpotImages', attributes: {exclude: ['spotId', 'reviewId', 'createdAt', 'updatedAt']}},
    // ]})
    //res.json(spot)
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


    const payload = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }

    return res.json(payload)

})

//Get all Reviews by a Spot's id - need to finish
router.get('/:spotId/reviews',async(req, res)=>{
    const { spotId } = req.params
    console.log(spotId)
    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        }
     })
     return res.json(reviews)
    })




module.exports = router;
