// models/OttServicemodel.js
import mongoose from "mongoose";
const { Schema } = mongoose;

// Subdocument for mainHeadings
const MainHeadingSchema = new Schema(
  {
    planDurations: { type: String, required: true },
    Price: { type: [String], default: [] }, // array of strings
  },
  { _id: false } // no separate _id for each subdocument
);

const OttServicemodelSchema = new Schema(
  {
    ottServiceName: { type: String, required: true },
    description: { type: String, required: true },

    images: {
      type: [String],
      default: [],
    },

    accessLicenseTypes: {
      type: [String],
      default: [],
    },

    videoQuality: { type: String, default: null },

    // your mainHeadings array
    mainHeadings: {
      type: [MainHeadingSchema],
      default: [],
    },

    price: { type: String, required: true },
    discountedPrice: { type: String, default: null },
    category: { type: String, required: true },
    stock: { type: String, default: "0" },

    // you used `date` in the schema (not `createdAt`)
    date: { type: String },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

const OttServicemodel = mongoose.model(
  "OttServicemodel",
  OttServicemodelSchema
);

export default OttServicemodel;
