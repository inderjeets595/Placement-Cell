const mongoose = require("mongoose");

const studentModel = require("../models/student.schema");
const companyModel = require("../models/company.schema");
const interviewModel = require("../models/interview.schema");

// Render the index page with lists of students, companies, and interviews
const index = async (req, res) => {
  try {
    // Retrieve all students, companies, and interviews from the database
    const [students, companies, interviews] = await Promise.all([
      studentModel.find(), // Fetch all students
      companyModel.find(), // Fetch all companies
      interviewModel.find().populate('student_id', 'name')   // Populate student names in interviews
                           .populate('company_id', 'name')  // Populate company names in interviews
    ]);

    // Render the 'interview' view with the retrieved data
    res.render('interview', {
      title: "Interview",
      students,
      companies,
      interviews
    });
  } catch (error) {
    console.error(error); // Log any errors
  }
};

// Add a new interview to the database
const addInterview = async (req, res) => {
  try {
    const { student_id, company_id, interview_date, status } = req.body;

    // Check if an interview with the same student, company, and status already exists
    const interviewExists = await interviewModel.findOne({ student_id, company_id, status });

    if (interviewExists) {
      req.flash('error', 'Interview already exists with this status!');
      return res.redirect('/employee/interview');
    }

    // Create and save a new interview
    const newInterview = new interviewModel({ student_id, company_id, interview_date, status });
    const createdInterview = await newInterview.save();

    // Add the interview ID to the student's list of interviews
    const interviewUpdated = await studentModel.findByIdAndUpdate(
      student_id,
      { $push: { interviews: createdInterview._id } },
      { new: true }
    );

    // If the interview was successfully added to the student, add it to the company's list of interviews
    if (interviewUpdated && interviewUpdated.interviews.includes(createdInterview._id)) {
      await companyModel.findByIdAndUpdate(
        company_id,
        { $push: { interviews: createdInterview._id } },
        { new: true }
      );
    } else {
      req.flash('error', 'Interview not updated in student data!');
    }

    req.flash('success', 'Interview created successfully!');
  } catch (error) {
    console.log(error.message); // Log any errors
    req.flash('error', error.message);
  }
  return res.redirect('/employee/interview');
};

// Retrieve and display details of a specific interview
const detailInterview = async (req, res) => {
  try {
    const interviewId = req.params.id.slice(1); // Extract interview ID from the URL parameter
    const interview = await interviewModel.findById(interviewId)
                                          .populate('student_id') // Populate student details
                                          .populate('company_id'); // Populate company details
    if (!interview) {
      req.flash("error", "Interview ID does not exist");
      return res.redirect('/employee/interview');
    }
    res.json(interview); // Send the interview details as JSON
  } catch (error) {
    console.error(error); // Log any errors
    req.flash("error", "An error occurred while fetching Interview detail");
    return res.redirect('/employee/interview');
  }
};

// Update an existing interview
const updateInterview = async (req, res) => {
  try {
    const interviewId = req.params.id; // Extract interview ID from the URL parameter
    const { interview_date, status } = req.body;

    // Update the interview with new details
    const updatedInterview = await interviewModel.findByIdAndUpdate(interviewId, { interview_date, status }, { new: true });
    if (!updatedInterview) {
      req.flash("error", "Interview not updated");
      return res.redirect('/employee/interview');
    }
    req.flash('success', 'Interview updated successfully!');
  } catch (error) {
    req.flash("error", "An error occurred while updating Interview detail");
  }
  return res.redirect('/employee/interview');
};

// Delete an interview and update related student and company records
const deleteInterview = async (req, res) => {
  try {
    const interviewId = req.params.id.slice(1); // Extract interview ID from the URL parameter

    // Delete the interview from the database
    const deleteInterview = await interviewModel.findByIdAndDelete(interviewId);
    if (!deleteInterview) {
      req.flash("error", "Interview ID not found.");
      return res.status(404).json({ error: 'Interview ID not found' });
    }

    const studentId = deleteInterview.student_id;
    // Remove the interview from the student's list of interviews
    const deleteInterviewFromStudent = await studentModel.findByIdAndUpdate(
      studentId,
      { $pull: { interviews: interviewId } },
      { new: true }
    );
    if (!deleteInterviewFromStudent) {
      req.flash("error", "Interview not remove from the student list.");
      return res.status(404).json({ error: 'Interview not remove from the student list.' });
    }

    const companyId = deleteInterview.company_id;
    // Remove the interview from the company's list of interviews
    const deleteInterviewFromCompany = await companyModel.findByIdAndUpdate(
      companyId,
      { $pull: { interviews: interviewId } },
      { new: true }
    );
    if (!deleteInterviewFromCompany) {
      req.flash("error", "Interview not remove from the company list.");
      return res.status(404).json({ error: 'Interview not remove from the company list' });
    }

    req.flash("success", "Interview successfully deleted.");
    return res.status(200).json({ message: 'Interview successfully deleted.' });
  } catch (error) {
    console.error(error); // Log any errors
    req.flash("error", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Retrieve and display interviews with the status 'Pass', sorted by creation date
const placedInterview = async (req, res) => {
  try {
    const placedInterviews = await interviewModel.find({ status: 'Pass' })
                           .populate('student_id')   // Populate student details
                           .populate('company_id')  // Populate company details
                           .sort({ createdAt: -1 }) // Sort by creation date in descending order
                           .limit(15); // Limit to the 15 most recent interviews

    // Render the 'recentlyPlaced' view with the retrieved data
    res.render('recentlyPlaced', {
      title: "Recently Placed",
      placedInterviews
    });
  } catch (error) {
    console.error(error); // Log any errors
  }
};

// Export the functions to be used in other parts of the application
module.exports = { index, addInterview, detailInterview, updateInterview, deleteInterview, placedInterview };
