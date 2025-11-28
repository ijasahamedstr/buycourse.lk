import express from "express";
import { OttServiceCreate, OttServiceDelete, OttServiceIndex, OttServiceSingleDetails, OttServiceUpdate } from "../controller/Ottservice.Controller.js";

// Create a new router instance
const OttserviceSection = express.Router();

// Create new course
OttserviceSection.post("/",OttServiceCreate);

// View all courses
OttserviceSection.get("/",OttServiceIndex);

// View single course details
OttserviceSection.get("/:id",OttServiceSingleDetails);

// Delete a course
OttserviceSection.delete("/:id",OttServiceDelete);

// Update a course
OttserviceSection.put("/:id",OttServiceUpdate);

export default OttserviceSection;
