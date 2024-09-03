// studentValidation.js

const { check, validationResult } = require('express-validator');

// Validation rules
const studentValidationRules = [
  check('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name should be at least 2 characters long'),

  check('gender')
    .notEmpty().withMessage('Gender is required'),

  check('dob')
    .notEmpty().withMessage('Date of Birth is required'),

  check('age')
    .isInt({ min: 15, max: 50 }).withMessage('Age should be between 15 and 50'),

  check('status')
    .notEmpty().withMessage('Status is required'),

  check('college')
    .notEmpty().withMessage('College is required'),

  check('batch')
    .notEmpty().withMessage('Batch is required'),

  check('dsa_score')
    .isInt({ min: 0, max: 100 }).withMessage('DSA score should be between 0 and 100'),

  check('webd_score')
    .isInt({ min: 0, max: 100 }).withMessage('WebD score should be between 0 and 100'),

  check('react_score')
    .isInt({ min: 0, max: 100 }).withMessage('React score should be between 0 and 100')
];

const validateStudent = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Render the form again with errors and existing data
    return res.render('dashboard', {
      title: 'Create Student',
      errors: errors.mapped(),  // Convert errors to an object
      studentData: req.body     // Preserve input values
    });
  }
  next();
};

module.exports = {
  studentValidationRules,
  validateStudent
};
