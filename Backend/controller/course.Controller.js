import moment from "moment";
import CourseModel from "../models/Course.models.js";


// Create a new course
export const CourseCreate = async (req, res) => {
  const {
    courseName,
    courseDescription,
    coursePrice,
    duration,
    courseImage,
    courseContent,
    courseSubContent,
    courseCategory,
  } = req.body;

  // Basic input validation (adjust required fields as needed)
  if (!courseName || !courseCategory || !coursePrice) {
    return res.status(400).json({
      status: 400,
      message: "Please provide courseName, courseCategory and coursePrice.",
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
      courseContent,
      courseSubContent,
      courseCategory,
      date,
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      status: 201,
      message: "Course created successfully.",
      data: savedCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error. Could not create the course.",
      error: error.message,
    });
  }
};

// Get all courses
export const CourseIndex = async (req, res) => {
    try {
        const Courseview = await CourseModel.find();
        res.json(Courseview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };


// Get single course details
export const CourseSingleDetails = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a course
export const CourseDelete = async (req, res) => {
    const CourseId =  req.params.id;

    try {
         await CourseModel.deleteOne({_id: CourseId})
         res.json({message:"User Promotionalgifts deleted!"});
    } catch (error) {
     res.status(500).json({message:error.message})
    }
};



// Update a course
export const CourseUpdate = async (req, res) => {
  const { id } = req.params;
  const {
    courseName,
    courseDescription,
    coursePrice,
    duration,
    courseImage,
    courseContent,
    courseSubContent,
    courseCategory,
  } = req.body;

  try {
    const course = await CourseModel.findById(id);
    if (!course) {
      return res.status(404).json({ status: 404, message: "Course not found" });
    }

    // Update fields if provided
    if (courseName !== undefined) course.courseName = courseName;
    if (courseDescription !== undefined) course.courseDescription = courseDescription;
    if (coursePrice !== undefined) course.coursePrice = coursePrice;
    if (duration !== undefined) course.duration = duration;
    if (courseImage !== undefined) course.courseImage = courseImage;
    if (courseContent !== undefined) course.courseContent = courseContent;
    if (courseSubContent !== undefined) course.courseSubContent = courseSubContent;
    if (courseCategory !== undefined) course.courseCategory = courseCategory;

    const updatedCourse = await course.save();

    res.status(200).json({ status: 200, data: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};
