const mongoose = require('mongoose');

// Define the schema for the Interview model
const interviewSchema = new mongoose.Schema(
  {
    // Reference to the Student model
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student', // Reference to the Student model
      required: true // Indicates that this field is mandatory
    },
    // The name of the student 
    studentName: {
      type: String,
    },
    // Reference to the Company model
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // Reference to the Company model
      required: true // Indicates that this field is mandatory
    },
    // The name of the company 
    companyName: {
      type: String
    },
    // The date and time of the interview
    interview_date: {
      type: Date,
      default: Date.now() // Default to the current date and time
    },
    // Status of the interview
    status: {
      type: String,
      enum: ["To be decided", "Pass", "Fail", "On Hold", "Didn't Attempt"], // Enumerated values for status
      required: true // Indicates that this field is mandatory
    }
  },
  {
    // Enable automatic creation of `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Create a model from the schema
const interviewModel = mongoose.model("Interview", interviewSchema);

// Export the model so it can be used in other parts of the application
module.exports = interviewModel;
