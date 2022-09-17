const express = require("express");

const router = express.Router();

const { Spot, Booking, Image, Review, User } = require("../../db/models")

//auth middleware
const { requireAuth } = require("../../utils/auth");
const { restoreUser } = require("../../utils/auth");




module.exports = router;

