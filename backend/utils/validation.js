const { validationResult, check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};

const validateSignup = [
  check('email', 'Invalid email')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isEmail(),
  check('username', 'Username is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  check('firstName', 'First Name is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  check('lastName', 'Last Name is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  handleValidationErrors
];

const validateSignin = [
  check('credential', 'Email or username is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  check('password', 'Password is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  handleValidationErrors
];

const validateSpot = [
	check("address", "Street address is required")
		.exists({ checkFalsy: true })
		.notEmpty(),
	check("city", "City is required").exists({ checkFalsy: true }).notEmpty(),
	check("state", "State is required").exists({ checkFalsy: true }).notEmpty(),
	check("country", "Country is required")
		.exists({ checkFalsy: true })
		.notEmpty(),
	check("lat", "Latitude is not valid")
		.exists({ checkFalsy: true })
		.notEmpty()
		.isDecimal(),
	check("lng", "Longitude is not valid")
		.exists({ checkFalsy: true })
		.notEmpty()
		.isDecimal(),
	check("name", "Name is required")
		.exists({ checkFalsy: true })
		.notEmpty()
		.isLength({ max: 50 })
		.withMessage("Name must be less than 50 characters"),
	check("description", "Description is required")
		.exists({ checkFalsy: true })
		.notEmpty(),
	check("price", "Price per day is required")
		.exists({ checkFalsy: true })
		.notEmpty(),
	check("previewImage", "Image is required")
		.exists({ checkFalsy: true })
		.notEmpty(),
	handleValidationErrors,
];

const validateImage = [
  check('url', 'URL is required')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isURL()
    .withMessage('URL is not valid'),
  handleValidationErrors
];

const validateReview = [
  check('review', 'Review text is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
    // changed to decimal value
  check('stars', 'Stars must be a decimal from 1.0 to 5.0')
    .exists({ checkFalsy: true })
    .isDecimal({ min: 1.0, max: 5.0 }),
  handleValidationErrors
];

const validateBooking = [
  check('startDate', 'startDate Date is required')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDate({ format: 'yyyy-mm-dd'})
    .withMessage('startDate is not valid')
    .custom((startDate) => {
      startDate = new Date(startDate + ' 15:30')
      const presentDate = new Date();
      if(startDate < presentDate) {
        throw new Error("startDate cannot come before today's Date");
      }
      return true;
    }),
  check('endDate', 'endDate is required')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDate({ format: 'yyyy-mm-dd'})
    .withMessage('endDate is not valid')
    .custom((endDate, { req }) => {
      endDate = new Date(endDate + ' 12:00')
      const startDate = new Date(req.body.startDate + ' 15:30');
      if(endDate < startDate) {
        throw new Error('endDate cannot be on or before startDate');
      }
      return true;
    }),
  handleValidationErrors,
  (req, res, next) => {
    req.body.startDate = new Date(req.body.startDate + ' 15:30');
    req.body.endDate = new Date(req.body.endDate + ' 12:00');
    next();
  }
];

module.exports = {
  handleValidationErrors,
  validateSignup,
  validateSignin,
  validateSpot,
  validateReview,
  validateBooking,
  validateImage
};
