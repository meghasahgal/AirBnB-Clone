const express = require("express");
const { up } = require("../../db/migrations/20220914034702-create-booking");

const router = express.Router();

const { Spot, Booking, Image, Review, User } = require("../../db/models")

//auth middleware
const { requireAuth } = require("../../utils/auth");
const { restoreUser } = require("../../utils/auth");
//validation
const {validateSignup,validateSignin,validateSpot,validateReview,validateBooking} = require("../../utils/validation")


//Get all of the Current User's Bookings - check output matches - done, make sure no dups of bookings
router.get('/current', requireAuth, restoreUser,  async(req, res)=>{
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

router.put('/:bookingId', requireAuth, restoreUser, validateBooking, async(req, res)=>{
    const userId = req.user.id;
    const { bookingId } = req.params;
    const { startDate, endDate} = req.body;
    const booking = await Booking.findByPk(bookingId,{
        where: {
            userId: req.user.id
        }
    })
    console.log(booking,"booking")
    //if no booking found
    if(!booking){
        res.status(404).json({
            message: "Booking couldn't be found",
	        statusCode: 404
        })
    }

    //if booking is past the end dates - taken care of by validateBooking

    // if booking end date has passed
    const presentDate = new Date()
    if(booking.endDate < presentDate){
        res.status(403).json({
            message: "Past bookings can't be modified",
            statusCode: 403
    })
    }
    //else update that shit
    //const { id, spotId, userId, startDate, endDate, createdAt, updatedAt} = req.body;
    else{
        updatedBooking = booking.set({
            startDate,
            endDate,
        })
        await updatedBooking.save()
        //take out the price
        const payload = {
            id: updatedBooking.id,
            spotId: updatedBooking.spotId,
            userId: updatedBooking.userId,
            startDate: updatedBooking.startDate,
            endDate: updatedBooking.endDate,
            createdAt: updatedBooking.createdAt,
            updatedAt: updatedBooking.updatedAt
        }
        res.json(payload)
    }
})




// Delete a Booking - need to add start date > end date
router.delete('/:bookingId', requireAuth, restoreUser, async(req, res)=>{
    const bookingToDelete = await Booking.findByPk(req.params.bookingId)
    //if can't find booking, throw error
    if(!bookingToDelete){
        res.status(404).json({
            	message: "Booking couldn't be found",
	            statusCode: 404
        })
    }

    //bookings that have been started can't be deleted
    const presentDate = new Date()

    if(bookingToDelete.startDate <= presentDate){
        res.status(403).json({
            message: "Bookings that have been started can't be deleted",
            statusCode: 403
    })
    }

    //else delete
    await bookingToDelete.destroy()
    res.status(200).json({
                message: "Successfully deleted",
	            statusCode: 200
    })


})



module.exports = router;
