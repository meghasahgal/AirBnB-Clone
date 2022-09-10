const express = require('express')
//for signup
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
//create express router
const router = express.Router();

// Sign up
router.post(
  '/',
  async (req, res) => {
    const { email, password, username } = req.body;
    const user = await User.signup({ email, username, password });

    //f the user is successfully created, then call setTokenCookie and return a JSON response with the user information
    await setTokenCookie(res, user);

    return res.json({
      user
    });
  }
);









module.exports = router;
