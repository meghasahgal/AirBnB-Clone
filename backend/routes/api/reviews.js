const express = require("express");

const router = express.Router();

const { Spot, Booking, Image, Review, User } = require("../../db/models")

//auth middleware
const { requireAuth } = require("../../utils/auth");
const { restoreUser } = require("../../utils/auth");


//Get all Reviews of the Current User - not working?
router.get('/current',restoreUser,requireAuth, async(req, res)=>{
    const userId = req.user.id
    //console.log(userId)
    const reviews = await Review.findAll({
        where: {
            userId: userId
        }
    })
    return res.json(reviews)
})





module.exports = router;
