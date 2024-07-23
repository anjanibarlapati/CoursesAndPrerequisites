import mongoose from 'mongoose';

async function dbConnection(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/courses");
        console.log("Connected successfully");
    } catch(Error){
        console.log("Error while connecting to the databse", Error)
    }
}

// mongoose.connect("mongodb://localhost:27017/courses", ()=> {
//     console.log("Connected");
//     },
//     e => console.log(e)
// );

dbConnection();

export default dbConnection;