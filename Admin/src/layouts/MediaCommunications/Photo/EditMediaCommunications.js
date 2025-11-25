import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Import Ant Design components
import { Image } from "antd";

// Import SweetAlert2
import Swal from "sweetalert2";

const EditMediaCommunications = () => {
  const [imagePreview, setImagePreview] = useState(null); // State to hold image preview
  const { id } = useParams();
  const [formData, setFormData] = useState({
    MediaCommunicationsphotoname: "",
    MediaCommunicationsphotoimage: null,
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success message state

  // Handle file upload and preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a URL for the selected file
      setImagePreview(previewUrl); // Set the preview URL
      setFormData({ ...formData, MediaCommunicationsphotoimage: file }); // Update the formData with the selected file
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
    if (!formData.MediaCommunicationsphotoname) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null); // Reset error before making the request
      setSuccess(null); // Reset success before making the request

      const formDataToSend = new FormData();
      formDataToSend.append("MediaCommunicationsphotoname", formData.MediaCommunicationsphotoname);
      if (formData.MediaCommunicationsphotoimage) {
        formDataToSend.append("photo", formData.MediaCommunicationsphotoimage);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_HOST}/MediaCommunicationsphoto/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      setLoading(false);

      // SweetAlert success message
      Swal.fire({
        title: "Success!",
        text: "Category updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      setLoading(false);
      setError("Error updating Printing data. Please try again.");

      // SweetAlert error message
      Swal.fire({
        title: "Error!",
        text: "Error updating Printing data. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    const fetchMediaCommunications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/MediaCommunicationsphoto/${id}`
        );
        setFormData({
          MediaCommunicationsphotoname: response.data.MediaCommunicationsphotoname,
          MediaCommunicationsphotoimage: response.data.MediaCommunicationsphotoimage, // Keep existing image data
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Error fetching Printing data. Please try again.");
        console.error("Error fetching Printing data: ", err);
      }
    };

    fetchMediaCommunications();
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
                  Edit Media Communications Photo
                </MDTypography>
              </MDBox>

              {/* Edit Category Form */}
              <MDBox pt={3} px={2} sx={{ paddingBottom: "24px" }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Category Name */}
                  <TextField
                    label="Printing Name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    name="Printingname"
                    value={formData.MediaCommunicationsphotoname}
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
                    {imagePreview || formData.MediaCommunicationsphotoimage ? (
                      <Image.PreviewGroup>
                        <Image
                          src={
                            imagePreview
                              ? imagePreview
                              : `${process.env.REACT_APP_API_HOST}/uploads/MediaCommunications/Photo/${formData.MediaCommunicationsphotoimage}`
                          }
                          alt="Printing Image"
                          style={{
                            maxWidth: "150px", // Set a smaller size for the image
                            borderRadius: "8px",
                          }}
                        />
                      </Image.PreviewGroup>
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

                  {/* Display Loading or Error/Success Messages */}
                  {loading && (
                    <MDTypography variant="body1" color="info">
                      Loading...
                    </MDTypography>
                  )}
                  {error && (
                    <MDTypography variant="body1" color="error">
                      {error}
                    </MDTypography>
                  )}
                  {success && (
                    <MDTypography variant="body1" color="success">
                      {success}
                    </MDTypography>
                  )}

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

export default EditMediaCommunications;
