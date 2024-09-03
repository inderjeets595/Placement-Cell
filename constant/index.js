require('dotenv').config()

module.exports = {
    MONGOURL: process.env.MONGODB_URL,
    DBNAME: process.env.DB_NAME,
    PORT: process.env.PORT,
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    CALLBACKURL: process.env.CALLBACKURL,
    MAILERRESETTOKEN: process.env.JWT_TOKEN,
    MAILERUSERNAME: process.env.EMAIL_USER,
    MAILERPASSWORD: process.env.PASS_USER,
    JWT_SECRET_TOKEN:process.env.JWT_TOKEN
};