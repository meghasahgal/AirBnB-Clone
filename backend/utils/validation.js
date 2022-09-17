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

//spot body validation
const validateSpot = [
  check('address', 'Street address is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  check('city', 'City is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  check('state', 'State is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  check('country', 'Country is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  check('lat', 'Latitude is not valid')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal(),
  check('lng', 'Longitude is not valid')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal(),
  check('name', 'Name is required')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description', 'Description is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  check('price', 'Price per day is required')
    .exists({ checkFalsy: true })
    .notEmpty(),
  handleValidationErrors
]


module.exports = {
  handleValidationErrors
};
