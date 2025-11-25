import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Import SweetAlert2
import Swal from "sweetalert2";

const EditMediaCommunications = () => {
  const [mediaPreview, setMediaPreview] = useState(null); // For new video preview
  const { id } = useParams();

  const [formData, setFormData] = useState({
    MediaCommunicationsvideoname: "",
    MediaCommunicationsvideotype: "",
    MediaCommunicationsvideo: null, // will be File OR string from API
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
      setFormData((prev) => ({ ...prev, MediaCommunicationsvideo: file }));
    }
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.MediaCommunicationsvideoname || !formData.MediaCommunicationsvideotype) {
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
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();
      formDataToSend.append("MediaCommunicationsvideoname", formData.MediaCommunicationsvideoname);
      formDataToSend.append("MediaCommunicationsvideotype", formData.MediaCommunicationsvideotype);

      // Append video ONLY if it's a File (not just the old string)
      if (formData.MediaCommunicationsvideo instanceof File) {
        formDataToSend.append("Video", formData.MediaCommunicationsvideo);
      }

      await axios.put(
        `${process.env.REACT_APP_API_HOST}/MediaCommunicationsvideo/${id}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess("Video updated successfully!");
      Swal.fire({
        title: "Success!",
        text: "Video updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      setError("Error updating Media Communications data. Please try again.");
      Swal.fire({
        title: "Error!",
        text: "Error updating Media Communications data. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating Media Communications data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch video by ID
  useEffect(() => {
    const fetchMediaCommunicationsvideo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/MediaCommunicationsvideo/${id}`
        );

        setFormData({
          MediaCommunicationsvideoname: response.data.MediaCommunicationsvideoname || "",
          MediaCommunicationsvideotype: response.data.MediaCommunicationsvideotype || "",
          MediaCommunicationsvideo: response.data.MediaCommunicationsvideo || null,
        });
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Media Communication video not found.");
        } else {
          setError("Error fetching MediaCommunicationsvideo data. Please try again.");
        }
        console.error("Error fetching MediaCommunicationsvideo data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaCommunicationsvideo();
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
                  Edit Media Communications Video
                </MDTypography>
              </MDBox>

              <MDBox pt={3} px={2} sx={{ paddingBottom: "24px" }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Video Name */}
                  <TextField
                    label="Media Name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    name="MediaCommunicationsvideoname"
                    value={formData.MediaCommunicationsvideoname}
                    onChange={handleInputChange}
                  />

                  {/* Video Type */}
                  <TextField
                    select
                    label="Video Type"
                    name="MediaCommunicationsvideotype"
                    value={formData.MediaCommunicationsvideotype}
                    onChange={handleInputChange}
                    sx={{
                      mb: 2,
                      height: "40px",
                      "& .MuiInputBase-root": {
                        height: "40px",
                      },
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      },
                    }}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="فيديو" style={{ fontFamily: "Tajawal, sans-serif" }}>
                      فيديو
                    </MenuItem>
                    <MenuItem
                      value="فيديوهات الواقع الافتراضي"
                      style={{ fontFamily: "Tajawal, sans-serif" }}
                    >
                      فيديوهات الواقع الافتراضي
                    </MenuItem>
                    <MenuItem value="فـوتـو" style={{ fontFamily: "Tajawal, sans-serif" }}>
                      فـوتـو
                    </MenuItem>
                    <MenuItem value="Motion graphics" style={{ fontFamily: "Tajawal, sans-serif" }}>
                      Motion graphics
                    </MenuItem>
                    <MenuItem value="Ai Videos" style={{ fontFamily: "Tajawal, sans-serif" }}>
                      Ai Videos
                    </MenuItem>
                    <MenuItem value="3D Animation" style={{ fontFamily: "Tajawal, sans-serif" }}>
                      3D Animation
                    </MenuItem>
                  </TextField>

                  {/* File Upload */}
                  <label htmlFor="file-upload">
                    <input
                      id="file-upload"
                      accept="video/*"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <Button variant="outlined" component="span" fullWidth sx={{ mb: 2 }}>
                      Upload Video
                    </Button>
                  </label>

                  {/* Video Preview */}
                  <MDBox display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                    {mediaPreview ? (
                      <video controls src={mediaPreview} style={{ maxWidth: "150px" }} />
                    ) : formData.MediaCommunicationsvideo ? (
                      <video
                        controls
                        src={`${process.env.REACT_APP_API_HOST}/uploads/MediaCommunications/Video/${formData.MediaCommunicationsvideo}`}
                        style={{ maxWidth: "150px" }}
                      />
                    ) : (
                      <MDTypography variant="body2" color="text">
                        No video selected
                      </MDTypography>
                    )}
                  </MDBox>

                  {/* Status messages */}
                  {loading && <MDTypography color="info">Loading...</MDTypography>}
                  {error && <MDTypography color="error">{error}</MDTypography>}
                  {success && <MDTypography color="success">{success}</MDTypography>}

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
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
