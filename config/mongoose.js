const mongoose = require('mongoose');
const { MONGOURL,DBNAME } = require('../constant');


const MONGODB_URI = MONGOURL || '0.0.0.0:27017'
const db = async()=>{
  try {
    await mongoose.connect(MONGODB_URI)
                  .then(() => console.log('Successfully Connected to Database!!'))
                  .catch((err) => console.error('Error while connecting to db:', err.message));
    
  } catch (error) {
    console.log(`Error while connecting to db ${error.message}`)
  }
}



module.exports= db;