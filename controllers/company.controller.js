const mongoose = require("mongoose");
const companyModel = require("../models/company.schema");
const studentModel = require('../models/student.schema');
const interviewModel = require("../models/interview.schema");
// Render the list of companies
const index = async (req, res) => {
  try {
    // Fetch all companies from the database
    const companies = await companyModel.find();
    // Render the 'company' view and pass the companies data
    res.render('company', {
      title: "Company",
      companies
    });
  } catch (error) {
    console.error(error);
    // Handle error (e.g., render an error page or return an error response)
  }
};

// Add a new company to the database
const addCompany = async (req, res) => {
  const { name, description } = req.body;

  // Check if a company with the same name already exists
  const company = await companyModel.findOne({ name });
  if (!company) {
    try {
      // Create a new company instance
      const newCompany = new companyModel({ name, description });
      // Save the new company to the database
      await newCompany.save();
      req.flash('success', 'Company created successfully!');
    } catch (err) {
      // Handle validation errors
      if (err.errors) {
        if (err.errors.name && err.errors.name.message) {
          req.flash('error', err.errors.name.message);
        } else if (err.errors.description && err.errors.description.message) {
          req.flash('error', err.errors.description.message);
        }
      } else {
        console.log("Unhandled error type:", err);
      }
    }
  } else {
    req.flash("info", "Company name already exists!");
  }
  // Redirect to the company page
  return res.redirect('/employee/company');
};

// Fetch and return details of a specific company
const detailCompany = async (req, res) => {
  try {
    // Extract company ID from request parameters
    const companyId = req.params.id.slice(1);

    // Fetch the company details and populate related interviews and students
    const company = await companyModel.findById(companyId)
      .populate({
        path: 'interviews',
        populate: {
          path: 'student_id',
          select: 'name'
        }
      });

    if (!company) {
      req.flash("success", "Company id not exists");
      return res.redirect('/employee/company');
    }

    // Send the company details as a JSON response
    res.json(company);
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while fetching company detail");
    return res.redirect('/employee/company');
  }
};

// Delete a specific company from the database
const deleteCompany = async (req, res) => {
  try {
    // Extract company ID from request parameters
    const companyId = req.params.id;

    // Find and delete the company by ID
    const deleteCompany = await companyModel.findByIdAndDelete(companyId);
    if (!deleteCompany) {
      req.flash("error", "Company not found.");
      return res.status(404).json({ error: 'Company not found' });
    }
    // Find and delete all interviews related to the deleted company
    const deletedInterviews = await interviewModel.find({ company_id: companyId });

    if (deletedInterviews.length > 0) {
      await interviewModel.deleteMany({ company_id: companyId });

      // Update the `interviews` field in all students that had interviews with this company
       const studentWithInterviews = await studentModel.find({interviews:{$in:deleteCompany.interviews}})
       for (const student of studentWithInterviews) {

        await studentModel.findByIdAndUpdate(
          student._id,
          {$pull:{interviews:{$in:deleteCompany.interviews}}},
          { new: true}
        )
       }
    }
    req.flash("success", "Company successfully deleted.");
    return res.status(200).json({ message: 'Company successfully deleted.' });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error occurred while deleting company.");
    return res.status(500).json({ error: 'Error occurred while deleting company' });
  }
};

// Export the functions to be used in company module
module.exports = { index, addCompany, detailCompany, deleteCompany };
