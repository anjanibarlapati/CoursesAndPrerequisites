import mongoose from 'mongoose';
// import db from '../Configuration/db.js';
// import { Schema } from 'mongoose';
// const model = mongoose.model;

const courseLevel = Object.freeze({
     SSC : "SSC",
     HSC :  "Higher Secondary",
     Diploma: "Diploma",
     Undergraduate: "Undergraduate",
     Postgraduate: "Postgraduate"
});

const CoursesSchema = new mongoose.Schema({
       name: {
            type: String,
            required: true,
            unique: true
       },
       level: {
          type: String,
          validate: {
               validator: function(value) {
                   return value === 'null' || Object.values(courseLevel).includes(value);
               },
               message: props => props.value+  " is not a valid value for level!"
           },
           //default: 'null'
       },
       courseType: {
          type: String,
          //default: 'null'
       }
});

export const Courses = mongoose.model('Course', CoursesSchema);