import dbConnection from "./Configuration/db.js";
import { insertData } from './insertions.js';
import express from 'express';
import {coursesRouter} from './Routes/courses.js';
const app = express();

async function start() {
    try{
        await dbConnection();
        //await insertData();

    } catch(Error) {
        console.log(Error)
    }
}
start();


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use('/',coursesRouter);


const PORT = process.env.PORT || 4320;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
