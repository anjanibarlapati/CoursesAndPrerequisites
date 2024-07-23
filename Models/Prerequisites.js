import mongoose from "mongoose";
// import dbConnection from "../Configuration/db.js";
import {Courses} from './Courses.js';

// const PrerequisitesSchema = new mongoose.Schema({
//       courseId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: Courses
//       },
//       prerequisites:[{
//          SSC: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: Courses
//          },
//          Inter: [{
//             type: mongoose.Schema.Types.ObjectId,
//             ref: Courses
//          }],
//         Undergraduate: [{
//             type: mongoose.Schema.Types.ObjectId,
//             ref: Courses
//         }],
//         postgraduate: [{
//             type: mongoose.Schema.Types.ObjectId,
//             ref: Courses
//         }]      
//       }]
// });

const PrerequisitesSchema = new mongoose.Schema({
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: Courses
      },
      prerequisites:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: Courses
      }]
});



export const Prerequisites = mongoose.model('Prerequisite', PrerequisitesSchema);