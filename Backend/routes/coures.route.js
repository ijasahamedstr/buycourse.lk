import express from "express";
import { CourseCreate } from "../controller/coures.Controller.js";

// Create a new router instance
const CourseSection = express.Router();

// Create new course
CourseSection.post("/",CourseCreate);


export default CourseSection;
