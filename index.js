const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo'); 
const { MONGOURL,DBNAME,PORT,JWT_SECRET_TOKEN } = require("./constant");
// Using Passport js
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const GoogleStrategy = require('./config/passport-google-oauth-strategy');

const app = express();

const assetsPath = path.join(__dirname, 'assets');
app.use('/assets', express.static(assetsPath));
// For Post Requests
app.use(express.urlencoded({ extended: true }));
// setting up view engine
app.set('view engine','ejs')
app.set('views','./views')

//initialize the session
app.use(session({
  name:'Placement Cell',
  secret: JWT_SECRET_TOKEN, // Replace with your secret key1
  resave: false,
  saveUninitialized: false,
  Cookie:{
    maxAge: (1000*60*100),
  },
  store:MongoStore.create({

      mongoUrl:`${MONGOURL}`,
      autoRemove: 'disabled'
     })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Initialize flash middleware
app.use(flash());
// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
    info: req.flash("info"),
    warning: req.flash("warning"),
  };
  next();
});

app.use('/',require('./routes'))
app.listen(PORT,(err)=>{
  if(err){
    console.log("Error Starting Server")
  }else{  
    require('./config/mongoose')()
    console.log(`Server started at port ${PORT}`);
  }
})