const mongoose=require('mongoose');
require('dotenv').config();
//Define  mongodb connection URL
const mongoURL = process.env.MONGO_URL ||  'mongodb://localhost:27017/mydatabase'     //mydatabase canbe replaced with our database name
   

//Set up mongodb connection
mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//Get the default connection
//Mongoose maintain  default connection object representing the mongodb connection
const db=mongoose.connection;

//Event Listener
db.on('connected' , () => {
    console.log('Connected to MongoDB Server');
})
db.on('error' , (err) => {
    console.log(' MongoDB connection eroor:' , err);
})
db.on('disconnected' , () => {
    console.log('DisConnected to MongoDB Server');
})

//Export the database connection
module.exports =db;