const express = require("express");

const router = express.Router();

const { Spot, Booking, Image, Review, User } = require("../../db/models")




//get all spots
router.get('/', async(req, res, next)=>{
    const allSpots = await Spot.findAll()
    return res.json(allSpots)
})

//get all spots owned by the current user -- NEED AUTHENT
// router.get('/current', async(req, res,next)=>{
//     const spots = await Spot.findAll({
//         where:{

//         }
//     })
//     return res.json(spots)
// })

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

//create a spot -- NEED AUTHENT
router.post('/', async(req, res, next)=>{
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const newSpot = await Spot.create({
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
    return res.status(201).json(newSpot)
} )

//delete a spot
router.delete('/:id', async(req,res,next)=>{
    const deletedSpot = await Spot.findByPk(req.params.id)
    await deletedSpot.destroy()
})

module.exports = router;
