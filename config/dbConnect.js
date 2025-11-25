
const mongoose=require('mongoose');
const Users=require('../models/userModel');
const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL, {
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: "majority"
        });
        console.log("Connected to database");
    }
    catch(err){
        console.log("Error while connecting to database",err.message);
        
        
        // Retry connection after 5 seconds
        setTimeout(() => {
            console.log("Retrying connection...");
            dbConnect();
        }, 5000);
    }
}
module.exports=dbConnect;