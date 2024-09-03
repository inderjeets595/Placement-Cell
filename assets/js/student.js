// Select the elements to display student details
const studentName = document.querySelector('#student-name');
const studentEmail = document.querySelector('#student-email');
const studentGender = document.querySelector('#student-gender');
const studentDob = document.querySelector('#student-dob');
const studentAge = document.querySelector('#student-age');
const studentCollege = document.querySelector('#student-college');
const studentBatch = document.querySelector('#student-batch');
const studentDsaScore = document.querySelector('#student-dsa-score');
const studentWebDScore = document.querySelector('#student-web-score');
const studentReactScore = document.querySelector('#student-react-score');

document.addEventListener('DOMContentLoaded', function () {
  // Add an event listener to the table body to handle click events
  document.querySelector('.tbody').addEventListener('click', async function (event) {
    
    // Check if the clicked element has the 'view-student' class
    if (event.target.classList.contains('view-student')) {
      // Parse the student ID from the button's data attribute
      const studentId = JSON.parse(event.target.getAttribute('data-studentid'));
  
      try {
        // Fetch student details via AJAX using the student ID
        const response = await fetch(`/employee/student/:${studentId}`);
        const student = await response.json();
      
        // Populate the student details in the modal or view
        studentName.textContent = student.name;
        studentEmail.textContent = student.email;
        studentGender.textContent = student.gender;
        studentDob.textContent = new Date(student.dob).toDateString().slice(4);
        studentAge.textContent = student.age;
        studentCollege.textContent = student.college;
        studentBatch.textContent = student.batch;
        studentDsaScore.textContent = student.dsa_score;
        studentWebDScore.textContent = student.webd_score;
        studentReactScore.textContent = student.react_score;
        
        // Handle the display of company details related to the student's interviews
        const interviewDetails = student?.interviews;  // Get interview details if they exist
        const companyDetailsTable = document.getElementById('companyDetails');  // Select the company details table
        companyDetailsTable.innerHTML = ''; // Clear any previous content in the table

        // Check if there are any interview details available
        if (interviewDetails.length > 0) {
          // Loop through each interview and create a table row
          interviewDetails.forEach(interview => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${interview.company_id.name}</td>
            <td>${new Date(interview.interview_date).toDateString().slice(4)}</td>
            <td>${interview.status}</td>
          `;
            companyDetailsTable.appendChild(row);  // Append the row to the table
          });
        } else {
          // If no interview details are available, show a message in the table
          const row = document.createElement('tr');
          row.innerHTML = '<td colspan="3" class="text-center">No Company Details Available</td>';
          companyDetailsTable.appendChild(row);
        }

        // Set the student ID for the delete button in the modal
        document.getElementById('deleteStudentBtn').setAttribute('data-studentid', studentId);

      } catch (error) {
        // Log any errors that occur during the fetching of student details
        console.error('Error fetching student details:', error);
      }

      // Add an event listener for the delete button inside the modal
      document.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-student')) {
          const studentId = event.target.getAttribute('data-studentid');
          deleteStudent(studentId);  // Call the delete function with the student ID
        } 
      });
    }

    // Check if the clicked element has the 'delete-student' class (outside the modal)
    if (event.target.classList.contains('delete-student')) {
      const studentId = JSON.parse(event.target.getAttribute('data-studentid'));
      deleteStudent(studentId);  // Call the delete function with the student ID
    }
  });
});

// Common function to handle student deletion
async function deleteStudent(studentId) {
    // Confirm with the user if they really want to delete the student
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        // Send a request to delete the student via AJAX
        const response = await fetch(`/employee/student/delete/${studentId}`);
        if (response.ok) {
          window.location.reload();  // Reload the page if deletion is successful
        } 
      } catch (error) {
        // Log any errors that occur during the deletion process
        console.error('Error deleting student:', error);
        alert('An error occurred while deleting the student.');
      }
    }
}
