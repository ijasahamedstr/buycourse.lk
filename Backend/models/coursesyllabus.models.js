import mongoose from "mongoose";
const { Schema } = mongoose;

const MainHeadingSchema = new Schema({
  heading: { type: String, required: true },
  subHeadings: { type: [String], default: [] } // array of strings
}, { _id: false }); // optional: disable _id on subdocs if you want

const CoursesSchema = new Schema({
  courseName: String,
  courseDescription: String,
  coursePrice: Number,
  duration: String,
  courseImage: String,

  // array of subdocuments { heading, subHeadings }
  mainHeadings: {
    type: [MainHeadingSchema],
    default: [],
  },

  courseCategory: String,
  coursedemovideolink: String,
  date: String,
}, {
  timestamps: true
});

const Courses = mongoose.model("Courses", CoursesSchema);
export default Courses;
