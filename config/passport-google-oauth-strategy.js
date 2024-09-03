const crypto = require("crypto")
const passport = require('passport')
const googleStrategy = require("passport-google-oauth2").Strategy;
const employeeModel = require('../models/employee.schema')
const {CLIENTID,CLIENTSECRET,CALLBACKURL} = require('../constant/index')


// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: CLIENTID,
      clientSecret: CLIENTSECRET,
      callbackURL: CALLBACKURL,
    }, async function (accessToken, refreshToken, profile, done) {
      const user = await employeeModel.findOne({ email: profile.emails[0].value });
      if (user) {
        // if found, set this user as req.user
        return done(null, user);
      }else{
        const newUsers= await employeeModel.create({
            name:profile.displayName,
            email:profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
        })
        return done(null, newUsers);
      }

    }
))


// serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});


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