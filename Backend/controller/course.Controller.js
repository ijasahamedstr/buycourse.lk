import moment from "moment";
import CourseModel from "../models/Course.models.js";

// At top of file:
// import CourseModel from '../model/Course.Model.js'; // adjust path/case to your project

export const CourseCreate = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    // Destructure only allowed fields
    let {
      courseName = "",
      courseDescription = "",
      coursePrice = 0,
      duration = "",
      courseImage = "",
      mainHeadings = [],
      courseCategory = "",
      coursedemovideolink = "",
    } = req.body ?? {};

    // Helper: parse JSON strings -> arrays/objects (keeps original value if parse fails)
    const parseIfString = (val) => {
      if (typeof val === "string") {
        const trimmed = val.trim();
        // try JSON first
        try {
          return JSON.parse(trimmed);
        } catch {
          // fallback comma-split
          if (trimmed.includes(",")) return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
          return trimmed;
        }
      }
      return val;
    };

    // Normalize mainHeadings to array of { heading: string, subHeadings: string[] }
    mainHeadings = parseIfString(mainHeadings);
    if (!Array.isArray(mainHeadings)) mainHeadings = [];

    mainHeadings = mainHeadings.map((mh) => {
      // mh could be string or object
      if (typeof mh === "string") {
        return { heading: mh.trim() || "Untitled", subHeadings: [] };
      }

      const rawHeading = mh.heading ?? mh.headingName ?? mh.title ?? "Untitled";
      let subHeadings = mh.subHeadings ?? mh.subs ?? mh.children ?? [];
      subHeadings = parseIfString(subHeadings);
      if (!Array.isArray(subHeadings)) subHeadings = [];

      // ensure subHeadings are strings
      subHeadings = subHeadings.map((s) => (s === null || s === undefined ? "" : String(s).trim())).filter(Boolean);

      return { heading: String(rawHeading).trim() || "Untitled", subHeadings };
    });

    // Sanitize simple fields
    courseName = String(courseName).trim();
    courseDescription = String(courseDescription).trim();
    courseCategory = String(courseCategory).trim();
    coursedemovideolink = String(coursedemovideolink).trim();
    duration = String(duration).trim();
    courseImage = String(courseImage).trim();

    // Ensure numeric price
    const parsedPrice = Number(coursePrice);
    coursePrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;

    // Example quick validation
    if (!courseName) {
      return res.status(400).json({ status: 400, message: "courseName is required." });
    }

    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Build the new course document
    const newCourse = new CourseModel({
      courseName,
      courseDescription,
      coursePrice,
      duration,
      courseImage,
      mainHeadings,
      courseCategory,
      coursedemovideolink,
      date,
      // optional defaults if your schema has these fields:
      // courseContent: [],
      // courseSubContent: []
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      status: 201,
      message: "Course created successfully.",
      data: savedCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error. Could not create the course.",
      error: error?.message ?? String(error),
    });
  }
};


// // Get all courses
// export const CourseIndex = async (req, res) => {
//     try {
//         const Courseview = await CourseModel.find();
//         res.json(Courseview);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
//   };


// // Get single course details
// export const CourseSingleDetails = async (req, res) => {
//   try {
//     const course = await CourseModel.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }
//     res.json(course);
//   } catch (error) {
//     console.error("Error fetching course:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a course
// export const CourseDelete = async (req, res) => {
//     const CourseId =  req.params.id;

//     try {
//          await CourseModel.deleteOne({_id: CourseId})
//          res.json({message:"User Promotionalgifts deleted!"});
//     } catch (error) {
//      res.status(500).json({message:error.message})
//     }
// };



// // Update a course

// export const CourseUpdate = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ status: 400, message: "Missing course id in params." });
//     }

//     console.log("Update incoming for id:", id, "body:", req.body);

//     // destructure only allowed/expected fields from body
//     let {
//       courseName,
//       courseDescription,
//       coursePrice,
//       duration,
//       courseImage,
//       mainHeadings,
//       courseCategory,
//       coursedemovideolink,
//     } = req.body;

//     // Helper: try to parse JSON strings, otherwise keep value
//     const parseIfString = (val) => {
//       if (typeof val === "string") {
//         try {
//           return JSON.parse(val);
//         } catch (err) {
//           if (val.includes(",")) return val.split(",").map((s) => s.trim());
//           return val;
//         }
//       }
//       return val;
//     };

//     // parse mainHeadings if provided
//     if (mainHeadings !== undefined) {
//       mainHeadings = parseIfString(mainHeadings);
//       if (!Array.isArray(mainHeadings)) mainHeadings = [];
//       mainHeadings = mainHeadings.map((mh) => {
//         if (typeof mh === "string") {
//           return { heading: mh, subHeadings: [] };
//         }
//         const heading = mh.heading ?? mh.headingName ?? "Untitled";
//         let subHeadings = mh.subHeadings ?? mh.subs ?? [];
//         if (typeof subHeadings === "string") {
//           try { subHeadings = JSON.parse(subHeadings); }
//           catch { subHeadings = subHeadings.split(",").map((s) => s.trim()); }
//         }
//         if (!Array.isArray(subHeadings)) subHeadings = [];
//         subHeadings = subHeadings.map((s) => String(s));
//         return { heading: String(heading), subHeadings };
//       });
//     }

//     // basic sanitization/validation (optional but helpful)
//     const updatePayload = {};
//     if (courseName !== undefined) updatePayload.courseName = courseName;
//     if (courseDescription !== undefined) updatePayload.courseDescription = courseDescription;

//     if (coursePrice !== undefined) {
//       // allow numeric strings but store as Number if valid
//       const num = Number(coursePrice);
//       if (Number.isNaN(num)) {
//         return res.status(400).json({ status: 400, message: "coursePrice must be a valid number." });
//       }
//       updatePayload.coursePrice = num;
//     }

//     if (duration !== undefined) updatePayload.duration = duration;
//     if (courseImage !== undefined) updatePayload.courseImage = courseImage;
//     if (coursedemovideolink !== undefined) updatePayload.coursedemovideolink = coursedemovideolink;
//     if (courseCategory !== undefined) updatePayload.courseCategory = courseCategory;
//     if (mainHeadings !== undefined) updatePayload.mainHeadings = mainHeadings;

//     // optional: update a 'dateUpdated' or keep updatedAt from timestamps — here we keep timestamps
//     // updatePayload.date = moment().format("YYYY-MM-DD"); // if you want to update custom date field

//     // find and update
//     const updated = await CourseModel.findByIdAndUpdate(id, updatePayload, {
//       new: true,
//       runValidators: true,
//       context: "query",
//     });

//     if (!updated) {
//       return res.status(404).json({ status: 404, message: "Course not found." });
//     }

//     return res.status(200).json({
//       status: 200,
//       message: "Course updated successfully.",
//       data: updated,
//     });
//   } catch (error) {
//     console.error("Error updating course:", error);
//     return res.status(500).json({
//       status: 500,
//       message: "Internal server error. Could not update the course.",
//       error: error.message,
//     });
//   }
// };
