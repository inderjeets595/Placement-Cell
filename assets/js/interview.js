// Selecting the form and input elements inside the modal for editing interviews
const editInterviewForm = document.querySelector('#editInterviewForm');
const studentIdElement = document.querySelector('#editInterviewModal #student_id');
const companyIdElement = document.querySelector('#editInterviewModal #company_id');
const interviewDateElement = document.querySelector('#editInterviewModal #interview_date');
const statusElement = document.querySelector('#editInterviewModal #status');

// Selecting the elements to display recent interview and student details
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

// Selecting the elements to display company and interview details
const companyName = document.querySelector('#cm-name');
const interviewDate = document.querySelector('#cm-date');
const companyStatus = document.querySelector('#cm-status');

document.addEventListener('DOMContentLoaded', function () {
  // Adding an event listener to the table body for handling clicks on various buttons
  document.querySelector('.tbody').addEventListener('click', async function (event) {

    // Check if the clicked element is the 'edit-interview' button
    if (event.target.classList.contains('edit-interview')) {
      const interviewId = JSON.parse(event.target.getAttribute('data-interviewId')); 
      
      try {
        // Fetch interview details via AJAX using the interview ID
        const response = await fetch(`/employee/interview/:${interviewId}`);
        const interview = await response.json();

        // Format the interview date for the input field
        const interviewDate = interview?.interview_date;
        const formattedDate = new Date(interviewDate).toISOString().split("T")[0];

        // Populate the form fields in the modal with fetched interview details
        studentIdElement.value = interview.student_id._id;
        studentIdElement.disabled = true;  // Disable editing of the student ID
        companyIdElement.value = interview.company_id._id;
        companyIdElement.disabled = true;  // Disable editing of the company ID
        interviewDateElement.value = formattedDate;  // Set the interview date
        statusElement.value = interview.status;  // Set the interview status

        // Set the form action URL to submit the edited interview details
        editInterviewForm.action = `/employee/interview/edit/${interview._id}`;

      } catch (error) {
        // Log any errors that occur during the fetching of interview details
        console.error('Error fetching interview details:', error);
      }
    }

    // Check if the clicked element is the 'delete-interview' button
    if(event.target.classList.contains('delete-interview')){
        const interviewId = JSON.parse(event.target.getAttribute('data-interviewId')); 
        
        // Confirm the deletion with the user
        if (confirm('Are you sure you want to delete this interview?')) {

          try {
            // Send a request to delete the interview via AJAX
            const response = await fetch(`/employee/interview/delete/:${interviewId}`);
            
            // If the deletion is successful, reload the page
            if (response.ok) {
              window.location.reload();
            }
            
          } catch (error) {
            // Log any errors that occur during the deletion of the interview
            console.error('Error deleting interview:', error);
            alert('An error occurred while deleting the interview.');
          }
        }
    }

    // Check if the clicked element is the 'view-interview' button
    if(event.target.classList.contains('view-interview')){
        const interviewId = JSON.parse(event.target.getAttribute('data-interviewId'));  // Get the interview ID from the clicked element's data attribute
        
        // Fetch interview details via AJAX using the interview ID
        const response = await fetch(`/employee/interview/:${interviewId}`);
        const interview = await response.json();
        
        console.log(interview);  // Log the interview details for debugging

        // Populate the DOM with the student details from the interview
        studentName.textContent = interview.student_id.name;
        studentEmail.textContent = interview.student_id.email;
        studentGender.textContent = interview.student_id.gender;
        studentDob.textContent = new Date(interview.student_id.dob).toDateString().slice(4);
        studentAge.textContent = interview.student_id.age;
        studentCollege.textContent = interview.student_id.college;
        studentBatch.textContent = interview.student_id.batch;
        studentDsaScore.textContent = interview.student_id.dsa_score;
        studentWebDScore.textContent = interview.student_id.webd_score;
        studentReactScore.textContent = interview.student_id.react_score;

        // Populate the DOM with the company details and interview date/status
        companyName.textContent = interview.company_id.name;
        interviewDate.textContent = new Date(interview.interview_date).toDateString().slice(4);
        companyStatus.textContent = interview.status;
    }
  });
});
