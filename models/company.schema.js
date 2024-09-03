const mongoose = require('mongoose');

// Define the schema for the Company model
const companySchema = new mongoose.Schema(
  {
    // Name of the company, must be unique, required field
    name: {
      type: String,
      unique: true, // Ensures company name is unique 
      required: [true, "Company Name is required"], // Custom error message if the field is missing
      maxLength: [30, "Company Name can't exceed 30 characters"], // Maximum length constraint
      minLength: [6, "Company Name should have at least 6 characters"] // Minimum length constraint
    },
    // Description of the company, required field
    description: {
      type: String,
      required: true, // Indicates that this field is mandatory
      maxLength: [250, "Company Description can't exceed 250 characters"], // Maximum length constraint
      minLength: [10, "Company Description should have at least 10 characters"] // Minimum length constraint
    },
    // Array of ObjectIds referencing the Interview model
    interviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview" // Reference to the Interview model
    }]
  },
  {
    // Enable automatic creation of `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Create a model from the schema
const companyModel = mongoose.model("Company", companySchema);

// Export the model so it can be used in company module
module.exports = companyModel;
