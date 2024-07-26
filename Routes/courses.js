import mongoose from 'mongoose';
import express from 'express';
import { Courses } from '../Models/Courses.js';
import { Prerequisites } from '../Models/Prerequisites.js';

export const coursesRouter = express.Router();

// Get all courses
coursesRouter.get('/allCourses/', async (req, res) => {
    try {
        const courses = await Courses.find({});
        if (courses.length === 0) return res.status(404).json({ message: "No Courses Found" });
        res.json({courses});

    } catch (Error) {
        res.status(500).json({message: Error.message});
    }
});

// Get a particular course
coursesRouter.get('/course', async (req, res) => {
       try {
        const course = await Courses.find(req.body);
        console.log("aaaa");
        if (course === null) {
            return res.status(404).json({ message: "Course Not Found" });
        }
        res.json(course);

       } catch(Error) {
           res.status(500).json({message: Error.message});
       }
});

// Get all prerequisites for a course

coursesRouter.get('/course1/:id', async (req, res) => {
    try {

        const prerequisites = await Prerequisites.findOne( {courseId: req.params.id} )
             .populate('courseId')
             .populate('prerequisites')
             .exec();
        if(prerequisites == null) {
            return res.status(404).json({ message: "Course Not Found" });
        }
        res.json(prerequisites);
        // return res.status(404).json({ message: "Course Not Found" });
     } catch(Error) { 
        res.status(500).json({message: Error.message});
    }
});

// { "courseId": "66a2453902106bbb7f9aead6" }  -- MBA
// 66a2453902106bbb7f9aead3 -- LLB

// Using $lookup


coursesRouter.get('/course/:id', async (req, res) => {
    try {
        const courseId = new mongoose.Types.ObjectId(req.params.id);

        const result = await Prerequisites.aggregate([
            { $match: { courseId: courseId } },
            {
                $lookup: {
                    from: "courses", 
                    localField: 'courseId', 
                    foreignField: '_id', 
                    as: 'courseDetails' 
                }
            },
            { $unwind: '$courseDetails' },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'prerequisites', 
                    foreignField: '_id', 
                    as: 'prerequisiteDetails'
                }
            },
            { $unwind: '$prerequisiteDetails'  },
            {
                $project: {
                    'courseId': 0,
                    'prerequisites': 0
                }
            },
            {
                $group: {
                    _id: '$courseId', 
                    courseDetails: { $first: '$courseDetails' }, 
                    prerequisiteDetails: { $push: '$prerequisiteDetails' } 
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Course Not Found" });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Get all the courses we can with for given prerequisite course

coursesRouter.get('/prerequisite/:name', async (req, res) => {
    try {

        const prerequisiteCourse = await Courses.findOne({ name: req.params.name });

        if (!prerequisiteCourse) {
            return res.status(404).json({ message: "Course not found." });
        }

        const coursesWithPrerequisite = await Prerequisites.find({ prerequisites: prerequisiteCourse._id }, 'courseId')
            .populate('courseId') 
            .exec();

        if(!coursesWithPrerequisite.length) {
            return res.status(404).json({ message: "No courses not found for this prerequisite course." });
        }
        res.json(coursesWithPrerequisite);

    } catch (Error) {
        res.status(500).json({message: Error.message});
        
    }
});
