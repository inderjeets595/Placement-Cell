const express = require('express');
const router = express.Router();

// Import Passport for authentication
const passport = require('passport');

// Import controllers for various functionalities
const employeeController = require('../controllers/employee.controller');
const studentController = require('../controllers/student.controller');
const companyController = require('../controllers/company.controller');
const interviewController = require('../controllers/interview.controller');
const csvController = require('../controllers/csv.controller');

// Route to render login page
router.get('/auth', employeeController.login);

// Route to handle user registration (signup)
router.post('/signup', employeeController.register);

// Route to handle user login and session creation
router.post('/create-session', passport.authenticate('local', { failureRedirect: '/employee/auth' }), employeeController.createSession);

// Route to render the dashboard (requires authentication)
router.get('/dashboard', passport.checkAuthentication, employeeController.dashboard);

// Route to handle user logout and session destruction
router.get('/logout', employeeController.destroySession);

// Route to handle forgot password requests
router.post('/forgot-password', employeeController.forgotPassword);

// Route to render password reset page with token
router.get('/reset-password/:token', employeeController.resetPassword);

// Route to handle password update submissions
router.post('/update-password', employeeController.updatePassword);

// Routes for student management
router.get('/student', studentController.student);  // Render student list page
router.post('/student/add', studentController.addStudent);  // Handle adding a new student
router.get('/student/:id', studentController.detailStudent);  // Render student details page
router.post('/student/edit/:id', studentController.updateStudent);  // Handle updating an student
router.get('/student/delete/:id', studentController.deleteStudent);  // Handle student deletion

// Routes for company management
router.get('/company', companyController.index);  // Render company list page
router.post('/company/add', companyController.addCompany);  // Handle adding a new company
router.get('/company/:id', companyController.detailCompany);  // Render company details page
router.get('/company/delete/:id', companyController.deleteCompany);  // Handle company deletion

// Routes for interview management
router.get('/interview', interviewController.index);  // Render interview list page
router.post('/interview/add', interviewController.addInterview);  // Handle adding a new interview
router.get('/interview/:id', interviewController.detailInterview);  // Render interview details page
router.post('/interview/edit/:id', interviewController.updateInterview);  // Handle updating an interview
router.get('/interview/delete/:id', interviewController.deleteInterview);  // Handle interview deletion

// Route to render recently placed students
router.get('/recent-placed', interviewController.placedInterview);

// Routes for CSV management
router.get('/csv', csvController.index);  // Render CSV export page
router.get('/download-csv', passport.checkAuthentication, csvController.downloadCSV);  // Handle CSV file download (requires authentication)

// Export the router module
module.exports = router;
