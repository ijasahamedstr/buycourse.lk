import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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

const EditPartner = () => {
  const [imagePreview, setImagePreview] = useState(null); // State to hold image preview
  const { id } = useParams();
  const [formData, setFormData] = useState({
    partnername: "",
    partnerimage: null,
  });
  const [loading, setLoading] = useState(false); // Loading state

  // Handle file upload and preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a URL for the selected file
      setImagePreview(previewUrl); // Set the preview URL
      setFormData({ ...formData, partnerimage: file }); // Update the formData with the selected file
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
    if (!formData.partnername) {
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
      formDataToSend.append("partnername", formData.partnername);
      if (formData.partnerimage) {
        formDataToSend.append("photo", formData.partnerimage);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_HOST}/Partner/${id}`,
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
        text: "Partner updated successfully!",
      });
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || "Error updating partner data. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  useEffect(() => {
    const fetchPartner = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/Partner/${id}`);
        setFormData({
          partnername: response.data.partnername,
          partnerimage: response.data.partnerimage, // Keep existing image data
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error fetching partner data. Please try again.",
        });
      }
    };

    fetchPartner();
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
                  Edit Partner
                </MDTypography>
              </MDBox>

              {/* Edit Partner Form */}
              <MDBox pt={3} px={2} sx={{ paddingBottom: "24px" }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Partner Name */}
                  <TextField
                    label="Partner Name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    name="partnername"
                    value={formData.partnername}
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
                        alt="Partner"
                        style={{
                          maxWidth: "150px", // Set a smaller size for the image
                          borderRadius: "8px",
                        }}
                      />
                    ) : formData.partnerimage ? (
                      <img
                        src={`${process.env.REACT_APP_API_HOST}/uploads/Partner/${formData.partnerimage}`}
                        alt="Partner"
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
                    {loading ? "Updating..." : "Update"}
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

export default EditPartner;
