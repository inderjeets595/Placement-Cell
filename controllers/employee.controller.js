const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const forgotPasswordMailer = require('../mailers/forget_password_mailer');

const employeeModel = require('../models/employee.schema');
const studentModel = require("../models/student.schema");
const companyModel = require("../models/company.schema");
const interviewModel = require("../models/interview.schema");
const {JWT_SECRET_TOKEN} =  require("../constant/index")

// Render login page or redirect to dashboard if already authenticated
const login = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/employee/dashboard');
  }
  // Render login page if user is not authenticated
  res.render('login', {
    title: 'SignIn/SignUp',
    errors: {}, // Object to hold validation errors
    showRegister: false // Flag to show/hide registration form
  });
};

// Handle user registration
const register = async (req, res) => {
  const { name, email, password } = req.body; // Extract user details from request body
  const user = await employeeModel.findOne({ email }); // Check if user with this email already exists
  
  if (!user) {
    try {
      // Create and save a new employee
      const employee = await employeeModel.create({ name, email, password });
      req.flash('success', 'User registered successfully!');
      return res.redirect('/employee/auth'); // Redirect to authentication page on success
    } catch (err) {
      let errors = {}; // Object to hold validation errors
      // Handle validation errors
      if (err.errors) {
        if (err.errors.name) errors.name = err.errors.name.message;
        if (err.errors.email) errors.email = err.errors.email.message;
        if (err.errors.password) errors.password = err.errors.password.message;
      } else {
        // Log other types of errors
        console.log("Unhandled error type:", err);
      }
      // Render login page with error messages
      res.render('login', { title: 'SignIn/SignUp', errors, name, email, password, showRegister: true });
    }
  } else {
    req.flash("info", "User already exists!"); 
    return res.redirect('/employee/auth'); // Redirect to authentication page
  }
};

// Create a session for authenticated user and redirect to dashboard
const createSession = (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("success", "Successfully logged In");
    return res.redirect("/employee/dashboard"); 
  } else {
    req.flash("error", "Invalid Username/Password"); // Inform user of login failure
    return res.redirect("/employee/auth"); 
  }
};

// Render dashboard with statistics
const dashboard = async (req, res) => {
  try {
    // Fetch counts of students, companies, and interviews concurrently
    const [totalStudent, totalCompany, totalInterview] = await Promise.all([
      studentModel.countDocuments(),
      companyModel.countDocuments(),
      interviewModel.countDocuments(),
    ]);

    // Render dashboard page with statistics
    res.render('dashboard', {
      title: 'Dashboard',
      errors: {},
      totalStudent,
      totalCompany,
      totalInterview
    });
  } catch (error) {
    console.error(error);
    // Handle error (e.g., render an error page or return an error response)
  }
};

// Destroy session and log out user
const destroySession = (req, res) => {
  req.logout((error) => {
    req.session.destroy(); // Destroy session after logout
    if (error) {
      req.flash("error", "Something went wrong!"); // Inform user of logout failure
      return;
    }
  });
  req.flash("success", "Successfully logged out"); // Inform user of successful logout
  return res.redirect("/employee/auth");
};

// Handle forgot password functionality
const forgotPassword = async (req, res) => {
  const email = req.body.email; // Extract email from request body
  const user = await employeeModel.findOne({ email: email }); // Check if user with this email exists
  
  if (!user) {
    req.flash("error", "User does not exists"); // Inform user if email is not registered
    return res.redirect("back");
  }
  
  // Create a JWT token for password reset
  const accessToken = jwt.sign(
    { _id: user._id },
    JWT_SECRET_TOKEN,
    { expiresIn: "1h" } // Token expires in 1 hour
  );

  // Send password reset email with the token
  await forgotPasswordMailer.forgetPasswordMail(user, accessToken);
  
  req.flash("success", "Email sent successfully"); // Inform user of successful email send
  return res.redirect("back"); 
};

// Render reset password page and verify token
const resetPassword = async (req, res) => {
  const accessToken = req.params.token; // Extract token from URL parameters
  
  try {
    // Verify the token
    const decoded = await jwt.verify(accessToken,JWT_SECRET_TOKEN);
    // Find user by ID from token
    const user = await employeeModel.findById(decoded._id);
    
    if (!user) {
      req.flash("error", "User does not exist"); // Inform user if no matching user is found
      return res.redirect("/employee/auth");
    }

    // Render password reset page with user details and token
    res.render("password-reset", {
      title: "Reset Password",
      user: user,
      accessToken: accessToken,
      showRegister: false,
    });

  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      req.flash("error", "Token is not valid"); // Inform user if token is invalid or expired
    } else {
      req.flash("error", err.name); // Inform user of other errors
    }
    console.log(err);
    return res.redirect("/employee/auth");
  }
};

// Update user password
const updatePassword = async (req, res) => {
  try {
    const { accessToken, newPassword, confirmPassword } = req.body;
    const decoded = await jwt.verify(accessToken, JWT_SECRET_TOKEN); // Verify the token
    const user = await employeeModel.findById(decoded._id); // Find user by ID
    
    if (!user) {
      req.flash("error", "User does not exist"); // Inform user if no matching user is found
      return res.redirect("back"); 
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      req.flash("error", "Password and Confirm Password do not match"); // Inform user of mismatch
      return res.redirect("back");
    }

    // Update and save the new password
    user.password = newPassword;
    await user.save();

    req.flash("success", "Password changed successfully"); // Inform user of successful password change
    return res.redirect("/employee/auth"); 

  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      console.error("Token is not valid", err);
      req.flash("error", "Token is not valid"); // Inform user if token is invalid
    } else if (err.name === "TokenExpiredError") {
      console.error("Token expired", err);
      req.flash("error", "Token expired"); // Inform user if token is expired
    } else {
      console.error("Error processing request", err);
      req.flash("error", "Error processing request"); // Inform user of other errors
    }
    return res.redirect("back"); // Redirect back to the previous page
  }
};

// Export the index function to be used in employee module
module.exports = {
  login,
  register,
  createSession,
  dashboard,
  destroySession,
  forgotPassword,
  resetPassword,
  updatePassword
};
