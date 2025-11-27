import moment from "moment";
import CourseModel from "../models/Course.models.js";

export const CourseCreate = async (req, res) => {
    const { courseName, courseDescription,coursePrice,duration,courseImage ,mainHeadings,courseCategory,coursedemovideolink} = req.body;

    // Input validation
    if (!courseName || !courseDescription || !coursePrice || !duration|| !courseImage|| !mainHeadings|| !courseCategory|| !coursedemovideolink) {
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
