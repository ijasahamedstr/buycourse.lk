import moment from "moment";
import OttServicemodel from "../models/Ottservice.models.js";

// controllers/ottServiceController.js
export const OttServiceCreate = async (req, res) => {
  try {
    let {
      ottServiceName,
      description,
      images,
      accessLicenseTypes,
      videoQuality,      // optional
      mainHeadings,      // array of { planDurations, Price }
      price,
      discountedPrice,   // optional
      category,
      stock,
    } = req.body;

    // Basic validation: required fields only
    if (!ottServiceName || !description || price == null || !category) {
      return res.status(400).json({
        status: 400,
        message:
          "Please provide ottServiceName, description, price, and category.",
      });
    }

    // ✅ Ensure images is always an array
    if (Array.isArray(images)) {
      // as is
    } else if (typeof images === "string" && images.trim() !== "") {
      // single value from form-data / urlencoded
      images = [images];
    } else {
      images = [];
    }

    // ✅ Ensure accessLicenseTypes is always an array
    if (Array.isArray(accessLicenseTypes)) {
      // as is
    } else if (
      typeof accessLicenseTypes === "string" &&
      accessLicenseTypes.trim() !== ""
    ) {
      // e.g. "single-device,multi-device"
      if (accessLicenseTypes.includes(",")) {
        accessLicenseTypes = accessLicenseTypes
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      } else {
        accessLicenseTypes = [accessLicenseTypes.trim()];
      }
    } else {
      accessLicenseTypes = [];
    }

    // ✅ Normalize mainHeadings (optional, only if you send it)
    if (!Array.isArray(mainHeadings)) {
      mainHeadings = [];
    }

    const date = moment().format("YYYY-MM-DD"); // matches your `date` field

    const newOTT = new OttServicemodel({
      ottServiceName,
      description,
      images,
      accessLicenseTypes,
      videoQuality: videoQuality || null,
      mainHeadings, // if you send it from frontend
      price,
      discountedPrice: discountedPrice || null,
      category,
      stock: stock ?? "0",
      date,
    });

    const savedOTT = await newOTT.save();

    return res.status(201).json({
      status: 201,
      message: "OTT created successfully.",
      data: savedOTT,
    });
  } catch (error) {
    console.error("Error creating OTT:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error. Could not create the OTT.",
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
