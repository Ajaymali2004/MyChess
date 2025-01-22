require('dotenv').config();
const mongoose =require('mongoose');
const mongoURI = process.env.MONGO_URL;

const connectToMongo = async () => {
        mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");   
};
module.exports = connectToMongo;