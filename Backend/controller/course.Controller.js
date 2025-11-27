import moment from "moment";
import CourseModel from "../models/Course.models.js";

// controller/Course.Controller.js

export const CourseCreate = async (req, res) => {
  const {
    courseName,
    courseDescription,
    coursePrice,
    duration,
    courseImage,
    mainHeadings,
    courseCategory,
    coursedemovideolink
  } = req.body;

  if (!courseName || !courseDescription || !coursePrice || !duration || !courseImage || !Array.isArray(mainHeadings) || !courseCategory || !coursedemovideolink) {
    return res.status(400).json({
      status: 400,
      message: "Please provide all required fields."
    });
  }

  try {
    const date = moment().format("YYYY-MM-DD");
    const newCourse = new CourseModel({
      courseName,
      courseDescription,
      coursePrice,
      duration,
      courseImage,
      mainHeadings: mainHeadings || [],
      courseCategory,
      coursedemovideolink,
      date
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({ status: 201, message: "Course created successfully.", data: savedCourse });
  } catch (error) {
    console.error("Error creating Course:", error);
    res.status(500).json({ status: 500, message: "Internal server error.", error: error.message });
  }
};

