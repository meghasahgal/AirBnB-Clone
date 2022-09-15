const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require("./spots.js");
// const reviewsRouter = require("./reviews.js");
// const imagesRouter = require("./images.js");
// const bookingsRouter = require("./bookings.js");
// backend/routes/index.js

// GET /api/restore-user -- keep
const { restoreUser } = require('../../utils/auth.js');
// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);
// router.use('/users', usersRouter);
// router.use('/reviews', reviewsRouter);
// router.use('/images', imagesRouter);
// router.use('/bookings', bookingsRouter);
// ...


// router.get('/restore-user',(req, res) => {
//     return res.json(req.user);
//   }
// );

// GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get('/require-auth',requireAuth, (req, res) => {
//     return res.json(req.user);
//   }
// );

//test
router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

// GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//       where: {
//         username: 'Demo-lition'
//       }
//     });
//   setTokenCookie(res, user);
//   return res.json({ user });
// });



module.exports = router;
