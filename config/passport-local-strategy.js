const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const employeeModel = require('../models/employee.schema')
const bcrypt = require("bcryptjs");


passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true,
},
  async function (req, email, password, done) {
    try {
      // Find the user by email
      const user = await employeeModel.findOne({ email: email });

      if (!user) {
        console.log("Invalid email/Password");
        req.flash("error", "Invalid email/Password");
        return done(null, false);
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (isMatch) {
        return done(null, user);
      } else {
        console.log("Invalid email/password");
        req.flash("error", "Invalid email/Password");
        return done(null, false);
      }
    } catch (error) {
      console.log("Error during authentication", error);
      return done(error);
    }
  }
))

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
})


passport.deserializeUser(async (id, done) => {
  try {
    const user = await employeeModel.findById(id);

    if (!user) {
      req.flash("error", "User not found");
      throw new Error("User not found");
    }

    return done(null, user);
  } catch (err) {
    console.log("Error in finding user --> Passport");
    return done(err);
  }
})

passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/employee/auth');
}


passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
  }
  next();
}

module.exports = passport