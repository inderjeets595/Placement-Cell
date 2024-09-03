const mongoose = require("mongoose");
const studentModel = require('../models/student.schema');
const companyModel = require("../models/company.schema");
const interviewModel = require("../models/interview.schema");

// Controller function to render the student page
const student = async (req, res) => {
  try {
    // Retrieve all students from the database
    const students = await studentModel.find();
    // Render the 'student' view
    res.render('student', {
      title: "Student",
      students
    });
  } catch (error) {
    // Log any errors that occur during the retrieval process
    console.error(error);
  }
};

// Controller function to add a new student
const addStudent = async (req, res) => {
  // Extract student data from request body
  const { name, email, gender, dob, age, college, batch, dsa_score, webd_score, react_score } = req.body;

  // Check if a student with the same email already exists
  const student = await studentModel.findOne({ email });

  if (!student) {
    try {
      // Create a new student record in the database
      const createStudent = await studentModel.create({
        name,
        email,
        gender,
        dob,
        age,
        college,
        batch,
        dsa_score,
        webd_score,
        react_score
      });
      // Set a success flash message and redirect to the student page
      req.flash('success', 'Student created successfully!');
      return res.redirect('/employee/student');
    } catch (error) {
      // Log and set an error flash message if creation fails
      console.log(error);
      req.flash('error', 'Student not created!');
      return res.redirect('/employee/student');
    }
  } else {
    // Set an info flash message if the student already exists
    req.flash("info", "Student already exists!");
    return res.redirect('/employee/student');
  }
};

// Controller function to retrieve and display details of a specific student
const detailStudent = async (req, res) => {
  try {
    // Extract student ID from request parameters
    const studentId = req.params.id.slice(1);
    // Find the student by ID and populate interview details with company names
    const student = await studentModel.findById(studentId)
                                      .populate({
                                        path: 'interviews',
                                        populate: {
                                          path: 'company_id',
                                          select: 'name'
                                        }
                                      });

    if (!student) {
      // Set a success flash message if the student ID does not exist and redirect
      req.flash("success", "Student id not exists");
      return res.redirect('/employee/student');
    }
    // Send the student details as a JSON response
    res.json(student);
  } catch (error) {
    // Log and set an error flash message if there is an issue retrieving student details
    console.error(error);
    req.flash("error", "An error occurred while fetching student details");
    return res.redirect('/employee/student');
  }
};

// Controller function to delete a student
const deleteStudent = async (req, res) => {
  try {
    // Extract student ID from request parameters
    const studentId = req.params.id;
    // Find and delete the student by ID
    const deletedStudent = await studentModel.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      // Set an error flash message
      req.flash("error", "Student not found.");
      return res.status(404).json({ error: 'Student not found' });
    }

    const deletedInterviews = await interviewModel.find({ student_id: studentId });
    if (deletedInterviews.length > 0) {
      // Delete all interviews related to the deleted student
      await interviewModel.deleteMany({ student_id: studentId });
      // Here update the `interviews` field in companies

      const companiesWithInterviews = await companyModel.find({ interviews: { $in: deletedStudent.interviews } });
      for (const company of companiesWithInterviews) {
        await companyModel.findByIdAndUpdate(
          company._id,
          { $pull: { interviews: { $in: deletedStudent.interviews } } },
          { new: true }
        );
      }
    }
    // Set a success flash message
    req.flash("success", "Student successfully deleted.");
    return res.status(200).json({ message: 'Student successfully deleted.' });
  } catch (error) {
    // Log and set an error flash message 
    console.error('Error deleting student:', error);
    req.flash("error", "Student not deleted");
    return res.status(500).json({ error: 'An error occurred while deleting the student.' });
  }
};

// Export the controller functions for use in student modules
module.exports = {
  student,
  addStudent,
  detailStudent,
  deleteStudent
};
