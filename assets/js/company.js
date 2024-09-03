// Select the elements to display company name and description
const companyName = document.querySelector('#cm-name');
const companyDescription = document.querySelector('#cm-description');

document.addEventListener('DOMContentLoaded', function() {
  // Add an event listener to the table body to handle click events
  document.querySelector('.tbody').addEventListener('click', async function (event) {

    // Check if the clicked element has the class 'view-company'
    if (event.target.classList.contains('view-company')) {
      
      // Get the company ID from the clicked element's data attribute and parse it
      const companyId = JSON.parse(event.target.getAttribute('data-companyid'));

      try {
        // Send an asynchronous request to fetch company details by company ID
        const response = await fetch(`/employee/company/:${companyId}`);
        
        // If the response is not ok, throw an error with the HTTP status code
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON response containing company details
        const company = await response.json();

        // Update the company name and description in the DOM
        companyName.textContent = company.name;
        companyDescription.textContent = company.description;

        // Get interview details associated with the company
        const interviewDetails = company.interviews;
        
        const companyDetailsTable = document.getElementById('companyDetails');
        companyDetailsTable.innerHTML = ''; // Clear any previous content in the table
        
        // If there are interview details, iterate over them and create rows in the table
        if (interviewDetails.length > 0) {
          interviewDetails.forEach((interview, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${interview.student_id.name}</td>
              <td>${new Date(interview.interview_date).toDateString().slice(4)}</td>
              <td>${interview.status}</td>
            `;
            companyDetailsTable.appendChild(row); // Append the row to the table
          });
        } else {
          // If no interview details are available, show a message in the table
          const row = document.createElement('tr');
          row.innerHTML = '<td colspan="3" class="text-center">No Company Details Available</td>';
          companyDetailsTable.appendChild(row);
        }

        // Set the company ID on the delete button for later deletion
        document.getElementById('deleteCompanyBtn').setAttribute('data-companyid', companyId);

      } catch (error) {
        // Log any errors that occur during the fetch request
        console.error('Error fetching company details:', error.message);
      }

      // Event listener to handle company deletion when 'delete-company' button is clicked
      document.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-company')) {
          const companyId = event.target.getAttribute('data-companyId');
          deleteCompany(companyId);  // Call the deleteCompany function with the company ID
        }
      });
    }

    // Handle company deletion directly if the delete-company button was clicked
    if (event.target.classList.contains('delete-company')) {
      const companyId = JSON.parse(event.target.getAttribute('data-companyId'));
      deleteCompany(companyId);  // Call the deleteCompany function with the company ID
    }
  });
});

// Asynchronous function to delete a company based on the provided company ID
async function deleteCompany(companyId) {
  // Confirm with the user before proceeding with the deletion
  if (confirm('Are you sure you want to delete this company?')) {
    try {
      // Send a request to the server to delete the company by ID
      const response = await fetch(`/employee/company/delete/${companyId}`);
      if (response.ok) {
        window.location.reload();
      } 
    } catch (error) {
      // Log any errors that occur during the deletion process
      console.log('Error deleting company:', error.message);
      alert('An error occurred while deleting the company.');
    }
  }
}
