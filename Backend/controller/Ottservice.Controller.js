import moment from "moment";
import OttServicemodel from "../models/Ottservice.models.js";

// Create OTT service
export const OttServiceCreate = async (req, res) => {
  const {
    ottServiceName,
    description,
    planDurations,          // optional array
    images,                 // optional array
    accessLicenseTypes,     // optional array
    videoQuality,           // optional string
    price,
    discountedPrice,        // optional price after discount
    category                // NEW FIELD
  } = req.body;

  // Minimal required validation
  if (!ottServiceName || !description || price == null || !category) {
    return res.status(400).json({
      status: 400,
      message: "Please provide ottServiceName, description, price, and category.",
    });
  }

  try {
    const date = moment().format("YYYY-MM-DD");

    const newService = new OttServicemodel({
      ottServiceName,
      description,
      planDurations: Array.isArray(planDurations) ? planDurations : (planDurations ? [planDurations] : []),
      images: Array.isArray(images) ? images : (images ? [images] : []),
      accessLicenseTypes: Array.isArray(accessLicenseTypes) ? accessLicenseTypes : (accessLicenseTypes ? [accessLicenseTypes] : []),
      videoQuality: videoQuality || null,
      price,
      discountedPrice: discountedPrice != null ? discountedPrice : null,
      category,                     // SAVE CATEGORY HERE
      createdAt: date,
    });

    const saved = await newService.save();

    res.status(201).json({
      status: 201,
      message: "OTT service created successfully.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating OTT service:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error. Could not create the OTT service.",
      error: error.message,
    });
  }
};

// Get all services
export const OttServiceIndex = async (req, res) => {
  try {
    const services = await OttServicemodel.find();
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single service details
export const OttServiceSingleDetails = async (req, res) => {
  try {
    const service = await OttServicemodel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "OTT service not found" });
    }
    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a service
export const OttServiceDelete = async (req, res) => {
  const serviceId = req.params.id;
  try {
    await OttServicemodel.deleteOne({ _id: serviceId });
    res.json({ message: "OTT service deleted!" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a service
export const OttServiceUpdate = async (req, res) => {
  const { id } = req.params;

  const {
    ottServiceName,
    description,
    planDurations,
    images,
    accessLicenseTypes,
    videoQuality,
    price,
    discountedPrice,
    category // NEW FIELD ADDED
  } = req.body;

  // Validate required
  if (!ottServiceName || !description || price == null || !category) {
    return res.status(400).json({
      status: 400,
      message: "Please provide ottServiceName, description, price, and category.",
    });
  }

  try {
    const updated = await OttServicemodel.findByIdAndUpdate(
      id,
      {
        ottServiceName,
        description,
        planDurations: Array.isArray(planDurations) ? planDurations : (planDurations ? [planDurations] : []),
        images: Array.isArray(images) ? images : (images ? [images] : []),
        accessLicenseTypes: Array.isArray(accessLicenseTypes) ? accessLicenseTypes : (accessLicenseTypes ? [accessLicenseTypes] : []),
        videoQuality: videoQuality || null,
        price,
        discountedPrice: discountedPrice != null ? discountedPrice : null,
        category, // UPDATE CATEGORY HERE
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: 404,
        message: "OTT service not found.",
      });
    }

    res.status(200).json({
      status: 200,
      message: "OTT service updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating OTT service:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
