import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// SweetAlert2
import Swal from "sweetalert2";

const EditArabicCalligraphy = () => {
  const [imagePreview, setImagePreview] = useState(null); // State to hold image preview
  const { id } = useParams();
  const [formData, setFormData] = useState({
    arabicCalligraphyname: "",
    arabicCalligraphyimage: null,
  });
  const [loading, setLoading] = useState(false); // Loading state

  // Handle file upload and preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a URL for the selected file
      setImagePreview(previewUrl); // Set the preview URL
      setFormData({ ...formData, arabicCalligraphyimage: file }); // Update the formData with the selected file
    }
  };

  // Handle input field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!formData.arabicCalligraphyname) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("arabicCalligraphyname", formData.arabicCalligraphyname);
      if (formData.arabicCalligraphyimage) {
        formDataToSend.append("photo", formData.arabicCalligraphyimage);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_HOST}/ArabicCalligraphy/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Category updated successfully!",
      });
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating gift data. Please try again.",
      });
    }
  };

  useEffect(() => {
    const fetchArabicCalligraphy = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/ArabicCalligraphy/${id}`
        );
        setFormData({
          arabicCalligraphyname: response.data.arabicCalligraphyname,
          arabicCalligraphyimage: response.data.arabicCalligraphyimage, // Keep existing image data
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error fetching gift data. Please try again.",
        });
      }
    };

    fetchArabicCalligraphy();
  }, [id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Edit Department of Arabic Calligraphy section
                </MDTypography>
              </MDBox>

              {/* Edit Category Form */}
              <MDBox pt={3} px={2} sx={{ paddingBottom: "24px" }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Category Name */}
                  <TextField
                    label="Category Name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    name="arabicCalligraphyname"
                    value={formData.arabicCalligraphyname}
                    onChange={handleInputChange} // Handle change
                  />

                  {/* Image Upload Field */}
                  <label htmlFor="file-upload">
                    <input
                      id="file-upload"
                      name="photo"
                      accept="image/*"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange} // Handle file selection
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      sx={{
                        mb: 2,
                        textTransform: "none",
                        borderColor: "#1976d2",
                        color: "#1976d2",
                        "&:hover": {
                          borderColor: "#1565c0",
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      Upload Image
                    </Button>
                  </label>

                  {/* Image Preview */}
                  <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      mb: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Gift"
                        style={{
                          maxWidth: "150px", // Set a smaller size for the image
                          borderRadius: "8px",
                        }}
                      />
                    ) : formData.arabicCalligraphyimage ? (
                      <img
                        src={`${process.env.REACT_APP_API_HOST}/uploads/ArabicCalligraphy/${formData.arabicCalligraphyimage}`}
                        alt="Gift"
                        style={{
                          maxWidth: "150px", // Set a smaller size for the image
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <img
                        src="https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg"
                        alt="Default Image"
                        style={{
                          maxWidth: "50px", // Set a smaller size for the image
                          borderRadius: "8px",
                        }}
                      />
                    )}
                  </MDBox>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ color: "#FFFFFF" }}
                    disabled={loading} // Disable button during loading
                  >
                    Update
                  </Button>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default EditArabicCalligraphy;
