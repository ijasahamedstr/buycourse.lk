import moment from "moment";
import CourseModel from "../models/Couressection.models.js";

export const CourseCreate = async (req, res) => {
    const { courseName, courseDescription,coursePrice,duration,courseImage ,mainHeadings,courseCategory,coursedemovideolink} = req.body;

    // Input validation
    if (!courseName || !courseDescription || !coursePrice || !duration|| !courseImage|| !mainHeadings|| !courseCategory) {
        return res.status(400).json({
            status: 400,
            message: 'Please provide gift name, gift type, and gift image.'
        });
    }

    try {
        const date = moment().format('YYYY-MM-DD');

        const newCoures = new CourseModel({
            courseName,
            courseDescription,
            coursePrice,
            duration,
            courseImage,
            mainHeadings: mainHeadings || [],
            courseCategory,
            coursedemovideolink,
            date,
        });

        const savedcoures = await newCoures.save();

        res.status(201).json({
            status: 201,
            message: 'News created successfully.',
            data: savedcoures,
        });
    } catch (error) {
        console.error('Error creating News:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error. Could not create the News.',
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

export const CourseUpdate = async (req, res) => {
  const { id } = req.params;

  const {
    courseName,
    courseDescription,
    coursePrice,
    duration,
    courseImage,
    mainHeadings,
    courseCategory,
    coursedemovideolink,
  } = req.body;

  // Simple validation (same style as create)
  if (
    !courseName ||
    !courseDescription ||
    !coursePrice ||
    !duration ||
    !courseImage ||
    !mainHeadings ||
    !courseCategory ||
    !coursedemovideolink
  ) {
    return res.status(400).json({
      status: 400,
      message: "Please fill all required fields.",
    });
  }

  try {
    const updated = await CourseModel.findByIdAndUpdate(
      id,
      {
        courseName,
        courseDescription,
        coursePrice,
        duration,
        courseImage,
        mainHeadings,
        courseCategory,
        coursedemovideolink,
      },
      { new: true } // returns updated document
    );

    if (!updated) {
      return res.status(404).json({
        status: 404,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Course updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating Course:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

