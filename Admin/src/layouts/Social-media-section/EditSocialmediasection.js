import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Image } from "antd";

const subTypeOptions = {
  "إدارة حسابات السوشيال ميديا": [
    "تحسين محركات البحث",
    "تحليل اداء الحسابات",
    "التفاعل الجماهيرى",
    "إنشاء وتطوير الحسابات",
  ],
  "إدارة الإعلانات المدفوعة": [
    "تصميم حملات بريدية",
    "تصميم خطط الترويج",
    "تصميم خطط إنتشار",
    "تصميم حملات إعلانية",
  ],
  "إنشاء المحتوى الإبداعي": [
    "إنتاج وتصوير الفيديو",
    "تصميمات الجرافيك",
    "كتابة المحتوس الابداعي",
    "بناء الهوية التجارية",
  ],
  "تحليل البيانات المختلفة": [
    "تحليل متغيرات العملاء",
    "تحليل المنافسين",
    "تحليل سلوك المستخدم",
    "تحليل أداء الحسابات",
  ],
  "الإستشارات التسويقية": [
    "خدمة العملاء",
    "تدريب الموظفين",
    "الحلول المتكاملة",
    "الاستراتيجيات والخطط",
  ],
};

const EditSocialMediaSection = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [soicalmedianame, setSoicalmedianame] = useState("");
  const [soicalmediamaintype, setSoicalmediamaintype] = useState("");
  const [soicalmediasubtype, setSoicalmediasubtype] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/Socialmedia/${id}`)
        .then((response) => {
          const data = response.data;
          setSoicalmedianame(data.soicalmedianame);
          setSoicalmediamaintype(data.soicalmediamaintype);
          setSoicalmediasubtype(data.soicalmediasubtype);
          setExistingImages(data.Soicalmediaimage || []);
        })
        .catch((error) => {
          Swal.fire({
            title: "Error!",
            text: error?.response?.data?.error || "Failed to fetch project data",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!soicalmedianame || !soicalmediamaintype || !soicalmediasubtype) {
      Swal.fire({
        title: "Error!",
        text: "Please fill all the fields before submitting.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("soicalmedianame", soicalmedianame);
    formData.append("soicalmediamaintype", soicalmediamaintype);
    formData.append("soicalmediasubtype", soicalmediasubtype);
    files.forEach((file) => formData.append("userimg", file));

    try {
      const method = id ? "put" : "post";
      const url = id
        ? `${process.env.REACT_APP_API_HOST}/Socialmedia/${id}`
        : `${process.env.REACT_APP_API_HOST}/Socialmedia`;

      const response = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        resetForm();
        Swal.fire({
          title: "Success!",
          text: "Your operation was successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        if (!id) {
          navigate("/path-to-redirect-after-submit");
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.error || "An error occurred",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    const previews = selectedFiles.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then((results) => setImagePreviews(results));
  };

  const resetForm = () => {
    setSoicalmedianame("");
    setSoicalmediamaintype("");
    setSoicalmediasubtype("");
    setFiles([]);
    setImagePreviews([]);
  };

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
                  {id ? "Update Social Media Section" : "Add New Category"}
                </MDTypography>
              </MDBox>

              <MDBox pt={3} px={2} sx={{ paddingBottom: "24px" }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Social Media Name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={soicalmedianame}
                    onChange={(e) => setSoicalmedianame(e.target.value)}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Social Media Main Type</InputLabel>
                    <Select
                      label="Social Media Main Type"
                      sx={{ height: "40px" }}
                      value={soicalmediamaintype}
                      onChange={(e) => setSoicalmediamaintype(e.target.value)}
                    >
                      {Object.keys(subTypeOptions).map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Social Media Sub Type</InputLabel>
                    <Select
                      label="Social Media Sub Type"
                      sx={{ height: "40px" }}
                      value={soicalmediasubtype}
                      onChange={(e) => setSoicalmediasubtype(e.target.value)}
                      disabled={!soicalmediamaintype} // Disable if no Main Type is selected
                    >
                      {soicalmediamaintype &&
                        subTypeOptions[soicalmediamaintype]?.map((subType) => (
                          <MenuItem key={subType} value={subType}>
                            {subType}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <label htmlFor="file-upload">
                    <input
                      id="file-upload"
                      accept="image/*"
                      type="file"
                      multiple
                      className="file-upload-input"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
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
                      Upload Images
                    </Button>
                  </label>

                  <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      mb: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "4px",
                      overflow: "auto",
                    }}
                  >
                    <Image.PreviewGroup>
                      {imagePreviews.length > 0 ? (
                        imagePreviews.map((preview, index) => (
                          <Image
                            key={index}
                            width={180}
                            height={120}
                            src={preview}
                            alt={`Preview ${index}`}
                          />
                        ))
                      ) : existingImages.length > 0 ? (
                        existingImages.map((image, index) => (
                          <Image
                            key={index}
                            width={180}
                            height={120}
                            src={`${process.env.REACT_APP_API_HOST}/uploads/Socialmedia/${image}`}
                            alt={`Existing Image ${index}`}
                          />
                        ))
                      ) : (
                        <Image
                          width={180}
                          height={120}
                          src="https://via.placeholder.com/180x120"
                          alt="No images available"
                        />
                      )}
                    </Image.PreviewGroup>
                  </MDBox>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ color: "#FFFFFF" }}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : id ? "Update" : "Submit"}
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

export default EditSocialMediaSection;
