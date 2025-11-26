import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDescription: {
      type: String,
      trim: true,
      default: "",
    },
    coursePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    duration: {
      // e.g. "8 weeks", "3 months", or a number of hours
      type: String,
      trim: true,
      default: "",
    },
    courseImage: {
      type: String, // URL to image
      trim: true,
      default: "",
    },
    courseContent: {
      // main sections / topics of the course
      type: [String],
      default: [],
    },
    courseSubContent: {
      // more granular items under each main content topic
      type: [String],
      default: [],
    },
    courseCategory: {
      type: String,
      trim: true,
      required: true,
    },
    // optional human-readable date field (kept for parity with your slider model)
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const CourseModel = mongoose.model("Course", CourseSchema);

export default CourseModel;
