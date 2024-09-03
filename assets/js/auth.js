// Get references to the sign-up, sign-in, and forgot password sections
const signUp = document.querySelector('.signup-form-section')
const signIn = document.querySelector('.login-form-section')
const forgotPassword = document.querySelector('#forgotPasswordSection')

// Get reference to the animation section
const animationSection = document.querySelector('.animation-section')

// Event listener to run once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initially hide the forgot password section
  forgotPassword.style.display = 'none';

  // Check the server-side variable "showRegister" If true, display the sign-up form and hide the other forms
  if (showRegister) {
    signUp.style.display = 'flex';  // Show the sign-up section
    signIn.style.display = 'none';  // Hide the sign-in section
    forgotPassword.style.display = 'none';  // Ensure forgot password is hidden

    // Add padding and borders to the animation section
    animationSection.style.padding = '2rem';
    animationSection.style.borderRight = '4px solid #E6DFDF';
    animationSection.style.borderLeft = '4px solid #E6DFDF';
  }
});

// Event listener for handling clicks on the page
document.addEventListener('click', (e) => {
  // Get the ID and class of the clicked element
  let fId = e.target.id;
  let fClass = e.target.classList.value;
  
  // Check if the clicked element has the class 'signup-btn'
  if (fClass == 'signup-btn') {
    signIn.style.display = 'none';  // Hide the sign-in section
    signUp.style.display = 'flex';  // Show the sign-up section
    forgotPassword.style.display = 'none';  // Hide the forgot password section

    // Set padding and borders for the animation section
    animationSection.style.padding = '2rem';
    animationSection.style.borderRight = '4px solid #E6DFDF';
    animationSection.style.borderLeft = '4px solid #E6DFDF';

  // Check if the clicked element has the class 'signin-btn'
  } else if (fClass == 'signin-btn') {
    signUp.style.display = 'none';  // Hide the sign-up section
    signIn.style.display = 'flex';  // Show the sign-in section
    forgotPassword.style.display = 'none';  // Hide the forgot password section

  // Check if the clicked element has the class 'forgot-password'
  } else if (fClass == 'forgot-password') {
    signUp.style.display = 'none';  // Hide the sign-up section
    signIn.style.display = 'none';  // Hide the sign-in section
    forgotPassword.style.display = 'flex';  // Show the forgot password section
    forgotPassword.style.justifyContent = 'space-around';  // Align content in the forgot password section

    // Set padding and borders for the animation section
    animationSection.style.padding = '2rem';
    animationSection.style.borderRight = '4px solid #E6DFDF';
    animationSection.style.borderLeft = '4px solid #E6DFDF';
  }
});
