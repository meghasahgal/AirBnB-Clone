const express = require("express");

const router = express.Router();

const { Spot, Booking, Image, Review, User } = require("../../db/models")

//auth middleware
const { requireAuth } = require("../../utils/auth");
const { restoreUser } = require("../../utils/auth");

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

//get details of a spot from an id
router.get('/:spotId', async(req, res, next)=>{
    const spot = await Spot.findByPk(req.params.spotId);

    if(!spot){
        res.status(404);
        res.json({
        message: "Spot couldn't be found",
    	statusCode: 404
        })
    }
    res.json(spot)
})

//create a spot --need to add error
router.post('/',requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
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

//edit a spot - need to add authorization re: user owning spot
router.put('/:id', requireAuth, async(req, res)=>{

})


//delete a spot by id - need to access the spot id
router.delete('/:spotId', requireAuth, async(req,res)=>{
    const userId = req.user.id
    const { spotId }  = req.params
    console.log(spotId, "spotId")
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

module.exports = router;
