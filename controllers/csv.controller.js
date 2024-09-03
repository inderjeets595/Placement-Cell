// Import required modules
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const studentModel = require('../models/student.schema');

// Render the CSV page
const index = async (req, res) => {
  res.render('csv', {
    title: "CSV"
  });
};

// Generate and download the CSV file
const downloadCSV = async (req, res) => {
  try {
    // Create a CSV writer instance
    const csvWriter = createObjectCsvWriter({
      path: 'students.csv', // Path where the CSV file will be saved
      header: [ // Define the header for the CSV file
        { id: 'studentId', title: 'Student ID' },
        { id: 'studentName', title: 'Student Name' },
        { id: 'studentEmail', title: 'Student Email' },
        { id: 'studentDob', title: 'Student Dob' },
        { id: 'studentAge', title: 'Student Age' },
        { id: 'college', title: 'College' },
        { id: 'batch', title: 'Batch' },
        { id: 'dsaFinalScore', title: 'DSA Score' },
        { id: 'webDFinalScore', title: 'Web Development Score' },
        { id: 'reactFinalScore', title: 'React Score' },
        { id: 'companyName', title: 'Company Name' },
        { id: 'interviewDate', title: 'Interview Date' },
        { id: 'interviewStatus', title: 'Interview Status' },
      ]
    });

    // Fetch students from the database and populate interview and company details
    const students = await studentModel.find()
      .populate({
        path: 'interviews',
        populate: {
          path: 'company_id',
          select: 'name'
        }
      });

    // Prepare records for CSV
    const records = [];
    students.forEach((student) => {
      // Handle cases where student might not have any interviews
      const studentData = student?.interviews.length > 0
        ? student.interviews
        : [{ interviewDate: 'Not Assigned', companyName: 'Not Assigned', interviewStatus: 'Not Assigned' }];

      studentData.map(interview => {
        records.push({
          studentId: student._id,
          studentName: student.name,
          studentEmail: student.email,
          studentDob: student.dob,
          studentAge: student.age,
          college: student.college,
          batch: student.batch,
          dsaFinalScore: student.dsa_score || 'N/A',
          webDFinalScore: student.webd_score || 'N/A',
          reactFinalScore: student.react_score || 'N/A',
          interviewDate: interview.interview_date || 'N/A',
          companyName: interview?.company_id?.name || 'N/A',
          interviewStatus: interview.status || 'N/A',
        });
      });
    });

    // Write records to CSV file
    await csvWriter.writeRecords(records);
    const filePath = path.resolve(__dirname, '..', 'students.csv');

    // Set headers for file download and send the file
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=students.csv");
    res.download(filePath, err => {
      if (err) {
        console.error("Error downloading CSV file:", err);
        return res.status(500).json({ message: 'Error downloading CSV file' });
      }
      // Optionally delete the file after download to free space
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting CSV file:", err);
      });
    });
  } catch (error) {
    console.error("Error generating CSV file:", error);
    res.status(500).json({ message: "Error generating CSV file" });
  }
};

module.exports = { index, downloadCSV };
