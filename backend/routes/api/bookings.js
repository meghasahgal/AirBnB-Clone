const express = require("express");

const router = express.Router();

const { Spot, Booking, Image, Review, User } = require("../../db/models")

//auth middleware
const { requireAuth } = require("../../utils/auth");
const { restoreUser } = require("../../utils/auth");
//validation
const {validateSignup,validateSignin,validateSpot,validateReview,validateBooking} = require("../../utils/validation")


//Get all of the Current User's Bookings - check output matches - done
router.get('/:userId', requireAuth, restoreUser,  async(req, res)=>{
    const userId = req.user.id
    const bookings = await Booking.findAll({
        attributes: {exclude: ['totalPrice']},
        where: {
            userId: req.user.id
        },
        include: {model: Spot, attributes: {exclude: ['description','avgRating', 'createdAt', 'updatedAt']}}
    })

    res.json(bookings)
})

//Edit a Booking, booking must belong to current user

router.put('/:bookingId', requireAuth, restoreUser, async(req, res)=>{
     //const userId = req.user.id;
    const { bookingId } = req.params;
    const { id, spotId, userId, startDate, endDate, createdAt, updatedAt} = req.body;
    const booking = await Booking.findByPk(bookingId)
    console.log(booking)
    //if no booking found
    if(!booking){
        res.json({
            message: "Booking couldn't be found",
	        statusCode: 404
        })
    }





})




// Delete a Booking - need to add start date > end date
router.delete('/:bookingId', requireAuth, restoreUser, async(req, res)=>{
    const bookingToDelete = await Booking.findByPk(req.params.bookingId)
    //if can't find booking, throw error
    if(!bookingToDelete){
        res.json({
            	message: "Booking couldn't be found",
	            statusCode: 404
        })
    }
    //else delete
    await bookingToDelete.destroy()
    res.json({
                message: "Successfully deleted",
	            statusCode: 200
    })


})



module.exports = router;
