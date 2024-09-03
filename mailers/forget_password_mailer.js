const nodeMailer = require("nodemailer");
const { MAILERUSERNAME, MAILERPASSWORD } = require('../constant/index');

// Create a transporter object using the default SMTP transport for Gmail
const transporter = nodeMailer.createTransport({
  service: "gmail", // Specify the email service provider (Gmail in this case)
  auth: {
    user: MAILERUSERNAME, // Email address used for sending emails
    pass: MAILERPASSWORD  // Password for the email account
  },
});

// Function to send a password reset email to the user
exports.forgetPasswordMail = async (user, accessToken) => {
  try {
    // Send the email using the transporter
    await transporter.sendMail({
      from: MAILERUSERNAME,
      to: user.email, 
      subject: "Reset Password", 
      html: `
        <div width="500px" height="700px">
          <h2>Reset Password</h2>
          <p>Dear ${user.name},</p>
          <p>You are receiving this email because you have requested the reset of the password for your account.</p>
          <p style="padding-bottom: 5px;">Please click on the following link:</p>
          <p>
            <a href="http://localhost:8080/employee/reset-password/${accessToken}" style="text-decoration: none; padding: 10px; color: white; border: none; background-color: #327D82; border-radius: 3px;">
              Click here to Reset Password
            </a>
          </p>
          <p style="padding-top: 5px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>
            Best regards,<br>
            CareerPool Team
          </p>
        </div>`,
    }, (err, info) => {
      if (err) {
        // Log any errors that occur during sending
        console.log("Error in sending mail", err);
        return;
      }
      // Log info if email is sent successfully (optional)
      console.log("Mail sent successfully:", info.response);
    });
  } catch (err) {
    // Log any errors that occur during the execution of the function
    console.log(err);
  }
}
