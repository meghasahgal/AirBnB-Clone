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






// router.post(
// 	"/:songId/comments",
// 	requireAuth,
// 	restoreUser,
// 	validateComments,
// 	async (req, res) => {
// 		const { user } = req;
// 		const { songId } = req.params;
// 		const { body } = req.body;
// 		const currentSong = await Song.findByPk(songId);
// 		if (!currentSong) {
// 			res.statusCode = 404;
// 			return res.json({
// 				message: "Song couldn't be found",
// 				statusCode: 404,
// 			});
// 		}
// 		const newComment = await Comment.create({
// 			userId: user.id,
// 			songId,
// 			body,
// 		});
// 		res.json(newComment);
// 	}
// );



module.exports = router;
