import express from "express";
import { CourseCreate, CourseDelete, CourseIndex, CourseSingleDetails, CourseUpdate } from "../controller/Course.Controller.js";

// Create a new router instance
const CourseSection = express.Router();

// Create new course
CourseSection.post("/", CourseCreate);

// View all courses
CourseSection.get("/", CourseIndex);

// View single course details
CourseSection.get("/:id", CourseSingleDetails);

// Delete a course
CourseSection.delete("/:id",CourseDelete );

// Update a course
CourseSection.put("/:id", CourseUpdate);

export default CourseSection;
