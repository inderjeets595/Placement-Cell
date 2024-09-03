const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the schema for the Employee model
const employeeSchema = new mongoose.Schema({
  // Employee's name, with validation for required fields
  name: {
    type: String,
    required: [true, "user name is required"], // Ensures the name is provided
    maxLength: [30, "user name can't exceed 30 characters"], // Maximum length for the name
    minLength: [2, "name should have at least 2 characters"], // Minimum length for the name
  },
  // Employee's email, with validation for uniqueness and correct email format
  email: {
    type: String,
    unique: true, // Ensures that each email is unique 
    required: [true, "Email is required"], // Ensures the email is provided
    validate: [validator.isEmail, "please enter a valid email"], // Validates that the email
  },
  // Employee's password, which will be hashed before saving
  password: {
    type: String,
    required: [true, "Please enter your password"], // Ensures the password is provided
  },
  // Timestamp for when the document was created
  created_at: {
    type: Date,
    default: Date.now() // Default value is the current date and time
  }
});

// Pre-save middleware for hashing the password before saving the document
employeeSchema.pre('save', async function(next) {
  // Check if the password field is modified
  if (!this.isModified('password')) return next();

  try {
    // Hash the password with a salt factor of 12
    this.password = await bcrypt.hash(this.password, 12);
    next(); // Proceed to the next middleware or save operation
  } catch (err) {
    next(err); // Pass the error to the next middleware or error handler
  }
});

// Method for comparing a given password with the hashed password stored in the database
employeeSchema.methods.comparePassword = async function(password) {
  // Compare the given password with the stored hashed password
  return await bcrypt.compare(password, this.password);
}

// Create the model from the schema
const employeeModel = mongoose.model("Employee", employeeSchema);

// Export the model for use in other parts of the application
module.exports = employeeModel;
