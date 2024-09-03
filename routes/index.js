const express = require('express');
const router = express.Router();  // Create a new router object
const passport = require('passport');  // Import Passport for authentication

// Import controllers for handling routes
const mainController = require('../controllers/main.controller');
const employeeController = require('../controllers/employee.controller');

// Route to render the homepage
router.get('/', mainController.index);

// Use the employee-related routes from another file
router.use('/employee', require('./employee.routes'));

// Route to initiate Google authentication using Passport
router.get('/new/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route to handle Google authentication callback
// If authentication fails, redirect to the employee authentication page
router.get('/auth/google/callback', passport.authenticate(
  'google',
  { failureRedirect: '/employee/auth' }
), employeeController.createSession);  // On successful authentication, create a session

// Export the router module
module.exports = router;
