const mongoose = require('mongoose');

// Define the schema for the Student model
const studentSchema = new mongoose.Schema({
  // Name of the student, required field
  name: {
    type: String,
    required: true
  },
  // Email of the student, 
  email: {
    type: String,
    required: true,
    unique: true
  },
  // Gender of the student, required field
  gender: {
    type: String,
    required: true
  },
  // Date of Birth of the student, required field
  dob: {
    type: String,
    required: true
  },
  // Age of the student, required field
  age: {
    type: Number,
    required: true
  },
  // College the student is attending, required field
  college: {
    type: String,
    required: true
  },
  // Batch or year of the student, required field
  batch: {
    type: Number,
    required: true
  },
  // Score in DSA (Data Structures and Algorithms), required field
  dsa_score: {
    type: Number,
    required: true
  },
  // Score in Web Development, required field
  webd_score: {
    type: Number,
    required: true
  },
  // Score in React, required field
  react_score: {
    type: Number,
    required: true
  },
  // Status of the student, can be 'placed' or 'not_placed', default is 'not_placed'
  status: {
    type: String,
    enum: ['Placed', 'Not Placed'],
    default: 'Not Placed'
  },
  // Array of ObjectIds referencing the Interview model
  interviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }],
  // Timestamp when the student document was created
  created_at: {
    type: Date,
    default: Date.now()
  }
});

// Create a model from the schema
const studentModel = mongoose.model('Student', studentSchema);

// Export the model so it can be used in student module 
module.exports = studentModel;
