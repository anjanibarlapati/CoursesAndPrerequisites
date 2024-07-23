import mongoose from 'mongoose';
// import db from '../Configuration/db.js';
// import { Schema } from 'mongoose';
// const model = mongoose.model;

const courseSpecification = Object.freeze({
     SSC : "SSC",
     Inter :  "Intermediate",
     Degree : "Degree",
     Engineering: "Engineering",
     Diploma: "Diploma",
     Medical: "Medical"
});

const CoursesSchema = new mongoose.Schema({
       name: {
            type: String,
            required: true,
            unique: true
       },
       specification: {
              type: String,
              enum: Schema.values(courseSpecification),
              required: true
       }
});

export const Courses = mongoose.model('Course', CoursesSchema);