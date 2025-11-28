import mongoose from 'mongoose';

// Define the schema
const OttServicemodelSchema = new mongoose.Schema({
  ottServiceName: { type: String, required: true },
  description: { type: String, required: true },
  planDurations: { type: [String], default: [] },        // e.g. ["1 month", "3 months"]
  images: { type: [String], default: [] },               // array of image URLs
  accessLicenseTypes: { type: [String], default: [] },   // e.g. ["single-device", "multi-device"]
  videoQuality: { type: String, default: null },         // e.g. "1080p", "4K"
  price: { type: Number, required: true },
  discountedPrice: { type: Number, default: null },
  category: { type: String, required: true },
  createdAt: { type: String },                           //
});


// Create the model
const OttServicemodel = mongoose.model('OttServicemodel', OttServicemodelSchema);

// Export the model
export default OttServicemodel;
