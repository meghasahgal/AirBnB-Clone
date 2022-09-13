const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

// catching Sequelize errors and formatting them before sending the error response.

const { ValidationError } = require('sequelize');

const app = express();
//for logging information about requests and responses:
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());



// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
// lax refers to It can be relaxed by using per session CSRF token instead of per request CSRF token.
app.use(
  csurf({
    cookie: { // cookie is HTTP-only
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);



// backend/app.js
const routes = require('./routes');

// ...
app.get('/', async(req,res)=>{
  res.json("successfully created.")
})

app.use(routes); // Connect all the routes

// Error Handling
//Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});


// Process sequelize errors; If the error that caused this error-handler to be called is an instance of ValidationError from the sequelize package, then the error was created from a Sequelize database validation error and the additional keys of title string and errors array will be added to the error and passed into the next error handling middleware.
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});


//error handler for formatting all the errors before returning a JSON response
// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;
