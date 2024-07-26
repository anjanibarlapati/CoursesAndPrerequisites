import mongoose from "mongoose";
import { Courses } from "./Models/Courses.js";
import { Prerequisites } from "./Models/Prerequisites.js";
import nconf from 'nconf';
import fs from 'fs';
import csvParser from 'csv-parser';

nconf.argv().file('config.json');

async function readCoursesCSVData(Path) {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(Path)
          .pipe(csvParser())
          .on('data', (data1) => data.push(data1))
          .on('end', () => resolve(data))
          .on('error', (Error) => reject(Error));
      }); 
}

async function readPrerequisitesCSVData(Path) {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(Path)
          .pipe(csvParser())
          .on('data', (row) => {
              const course = {
                  courseName: row.courseName,
                  prerequisiteNames: []
              };
              if (row.prerequisiteNames) {
                  course.prerequisiteNames = row.prerequisiteNames.slice(1, -1).split(',').map(name => name);;
              }
              data.push(course);
          })
          .on('end', () => resolve(data))
          .on('error', (error) => reject(error));
    });
}

async function insert(prerequisitesData) {
      try {
          const preData = [];
          const coursesIds = await Courses.find({}, '_id name');


          prerequisitesData.forEach(element => {
            const courseId = coursesIds.find(ele => ele.name==element.courseName)._id;

            const pIds = [];
            for(let course of (element.prerequisiteNames)) {
                const pId = coursesIds.find(ele => ele.name==course)._id;
                pIds.push(pId);
            }
            preData.push({courseId: courseId, prerequisites: pIds});
           
          });

          await Prerequisites.insertMany(preData);

      } catch(Error) {
        console.log(Error);
      }  
}


export async function insertData()
{
    try{
        const coursesPath = nconf.get('coursesDataPath');
        const prerequisitesPath = nconf.get('prerequisitesDataPath');

        if(!coursesPath || ! prerequisitesPath) {
            throw new Error("Courses dath path or Prerequisites data path are not defined")
        }
        const coursesData = await readCoursesCSVData(coursesPath);
        //console.log(coursesData);

        const prerequisitesData = await readPrerequisitesCSVData(prerequisitesPath);
       // console.log(prerequisitesData);

        await Courses.insertMany(coursesData); // using upsert
        console.log("Inserted data into Prerequisites collection successfully"); 
        await insert(prerequisitesData);
        console.log("Inserted data into Courses collection successfully"); 
       

    } catch(Error) {
        console.log("Error while inserting data", Error);
    }
    
};







