import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const CATEGORIES = [
  "AI",
  "Digital Key",
  "Games",
  "OTT",
  "Premium Account",
  "Streaming Combos",
  "Utilities",
  "VPN",
];

const isImageUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    return /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i.test(u.pathname);
  } catch {
    return false;
  }
};

export default function EditOttService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_HOST || "";
  const ENDPOINT = `${apiBase}/Ottservice`;

  const [loading, setLoading] = useState(true); // initial load
  const [saving, setSaving] = useState(false); // submit
  const [deleting, setDeleting] = useState(false);

  const [service, setService] = useState({
    ottServiceName: "",
    description: "",
    category: "",
    planDurations: [],
    images: [],
    accessLicenseTypes: [],
    videoQuality: "",
    price: "",
    discountedPrice: "",
  });

  const [tempInput, setTempInput] = useState({ planDuration: "", imageUrl: "", licenseType: "" });
  const [errors, setErrors] = useState({});

  // load service
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await axios.get(`${ENDPOINT}/${id}`);
        const data = res?.data;
        if (!mounted) return;
        if (!data) {
          Swal.fire("Not found", "Service not found", "error");
          navigate("/OttServices", { replace: true });
          return;
        }
        // Ensure shape and fallback types
        setService({
          ottServiceName: data.ottServiceName || "",
          description: data.description || "",
          category: data.category || "",
          planDurations: Array.isArray(data.planDurations) ? data.planDurations : [],
          images: Array.isArray(data.images) ? data.images : [],
          accessLicenseTypes: Array.isArray(data.accessLicenseTypes) ? data.accessLicenseTypes : [],
          videoQuality: data.videoQuality || "",
          price: data.price != null ? String(data.price) : "",
          discountedPrice: data.discountedPrice != null ? String(data.discountedPrice) : "",
        });
      } catch (err) {
        console.error("Failed to load", err);
        Swal.fire("Error", "Failed to load service", "error");
        navigate(-1);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, [ENDPOINT, id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  // plan handlers
  const addPlanDuration = () => {
    const trimmed = tempInput.planDuration.trim();
    if (!trimmed) return setErrors((p) => ({ ...p, planDuration: "Cannot be empty." }));
    if (service.planDurations.includes(trimmed))
      return setErrors((p) => ({ ...p, planDuration: "Already added." }));
    setService((p) => ({ ...p, planDurations: [...p.planDurations, trimmed] }));
    setTempInput((p) => ({ ...p, planDuration: "" }));
    setErrors((p) => ({ ...p, planDuration: "" }));
  };
  const removePlanDuration = (i) =>
    setService((p) => ({ ...p, planDurations: p.planDurations.filter((_, idx) => idx !== i) }));

  // images handlers
  const addImage = () => {
    const url = tempInput.imageUrl.trim();
    if (!url) return setErrors((p) => ({ ...p, imageUrl: "Image URL cannot be empty." }));
    if (!isImageUrl(url)) return setErrors((p) => ({ ...p, imageUrl: "Not a direct image URL." }));
    if (service.images.includes(url))
      return setErrors((p) => ({ ...p, imageUrl: "Already added." }));
    setService((p) => ({ ...p, images: [...p.images, url] }));
    setTempInput((p) => ({ ...p, imageUrl: "" }));
    setErrors((p) => ({ ...p, imageUrl: "" }));
  };
  const removeImage = (i) =>
    setService((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  // license handlers
  const addLicenseType = () => {
    const val = tempInput.licenseType.trim();
    if (!val) return setErrors((p) => ({ ...p, licenseType: "Cannot be empty." }));
    if (service.accessLicenseTypes.includes(val))
      return setErrors((p) => ({ ...p, licenseType: "Already added." }));
    setService((p) => ({ ...p, accessLicenseTypes: [...p.accessLicenseTypes, val] }));
    setTempInput((p) => ({ ...p, licenseType: "" }));
    setErrors((p) => ({ ...p, licenseType: "" }));
  };
  const removeLicenseType = (i) =>
    setService((p) => ({
      ...p,
      accessLicenseTypes: p.accessLicenseTypes.filter((_, idx) => idx !== i),
    }));

  const validate = () => {
    const e = {};
    if (!service.ottServiceName.trim()) e.ottServiceName = "Service name is required.";
    if (!service.category) e.category = "Please select a category.";
    if (service.price === "" || service.price === null) e.price = "Price is required.";
    else if (Number.isNaN(Number(service.price))) e.price = "Price must be a number.";
    if (service.discountedPrice && Number.isNaN(Number(service.discountedPrice)))
      e.discountedPrice = "Discounted price must be a number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    Swal.fire({
      title: "Updating...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const payload = {
        ottServiceName: service.ottServiceName,
        description: service.description,
        category: service.category,
        planDurations: service.planDurations,
        images: service.images,
        accessLicenseTypes: service.accessLicenseTypes,
        videoQuality: service.videoQuality,
        price: Number(service.price),
        discountedPrice: service.discountedPrice ? Number(service.discountedPrice) : undefined,
      };
      const res = await axios.put(`${ENDPOINT}/${id}`, payload);
      Swal.close();
      if (!res || res.status >= 300 || res.data?.error) {
        await Swal.fire("Error", res?.data?.message || "Failed to update.", "error");
      } else {
        await Swal.fire("Updated", res?.data?.message || "OTT Service updated.", "success");
        navigate(-1);
      }
    } catch (err) {
      Swal.close();
      console.error(err);
      await Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the service.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });
    if (!confirmed.isConfirmed) return;
    setDeleting(true);
    try {
      await axios.delete(`${ENDPOINT}/${id}`);
      Swal.fire("Deleted", "Service deleted.", "success");
      navigate("/OttServices");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // memoized preview validity for temp image url
  const tempImageIsValid = useMemo(() => isImageUrl(tempInput.imageUrl), [tempInput.imageUrl]);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          pt={6}
          pb={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

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
                <MDTypography
                  variant="h6"
                  color="white"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <EditIcon /> Edit OTT Service
                </MDTypography>

                <Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                    disabled={deleting}
                    startIcon={deleting ? <CircularProgress size={18} /> : <DeleteIcon />}
                    sx={{ mr: 1 }}
                  >
                    Delete
                  </Button>
                </Box>
              </MDBox>

              <MDBox pt={3} px={2} sx={{ paddingBottom: "24px" }}>
                <form noValidate onSubmit={handleSave}>
                  <TextField
                    label="Service Name"
                    name="ottServiceName"
                    value={service.ottServiceName}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    error={Boolean(errors.ottServiceName)}
                    helperText={errors.ottServiceName}
                  />

                  <TextField
                    label="Description"
                    name="description"
                    value={service.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={3}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2, height: 55 }}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      label="Category"
                      name="category"
                      value={service.category}
                      onChange={handleChange}
                      sx={{ mb: 2, height: 55 }}
                    >
                      {CATEGORIES.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <MDTypography variant="caption" color="error">
                        {errors.category}
                      </MDTypography>
                    )}
                  </FormControl>

                  {/* plan durations */}
                  <MDTypography variant="subtitle2">Plan Durations (optional)</MDTypography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1, mt: 1 }}>
                    <TextField
                      size="small"
                      label="e.g. 1 month, 1 year"
                      value={tempInput.planDuration}
                      onChange={(e) =>
                        setTempInput((p) => ({ ...p, planDuration: e.target.value }))
                      }
                      helperText={errors.planDuration}
                      error={Boolean(errors.planDuration)}
                      sx={{ flex: 1 }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addPlanDuration();
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addPlanDuration}
                      style={{ color: "black" }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    {service.planDurations.map((pd, i) => (
                      <Box
                        key={pd + i}
                        sx={{
                          px: 1,
                          py: 0.4,
                          borderRadius: 1,
                          border: "1px solid rgba(0,0,0,0.06)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <MDTypography variant="caption">{pd}</MDTypography>
                        <IconButton size="small" onClick={() => removePlanDuration(i)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  {/* images */}
                  <MDTypography variant="subtitle2">Images (optional)</MDTypography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1, mt: 1 }}>
                    <TextField
                      size="small"
                      label="Image URL"
                      value={tempInput.imageUrl}
                      onChange={(e) => setTempInput((p) => ({ ...p, imageUrl: e.target.value }))}
                      helperText={errors.imageUrl}
                      error={Boolean(errors.imageUrl)}
                      sx={{ flex: 1 }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImage();
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addImage}
                      style={{ color: "black" }}
                    >
                      Add
                    </Button>
                  </Box>

                  {tempInput.imageUrl && tempImageIsValid && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <img
                        src={tempInput.imageUrl}
                        alt="temp-preview"
                        style={{
                          width: 140,
                          height: 90,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: "1px solid rgba(0,0,0,0.08)",
                        }}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </Box>
                  )}

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    {service.images.map((img, i) => (
                      <Box
                        key={img + i}
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          border: "1px solid rgba(0,0,0,0.15)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: 120,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={img}
                          alt={`preview-${i}`}
                          style={{
                            width: "100%",
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 4,
                            background: "#f6f6f6",
                          }}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <MDTypography
                          variant="caption"
                          sx={{
                            mt: 1,
                            wordBreak: "break-all",
                            textAlign: "center",
                            fontSize: "10px",
                          }}
                        >
                          {img}
                        </MDTypography>
                        <IconButton
                          size="small"
                          onClick={() => removeImage(i)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "rgba(255,255,255,0.8)",
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  {/* access license types */}
                  <MDTypography variant="subtitle2">Access License Types (optional)</MDTypography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1, mt: 1 }}>
                    <TextField
                      size="small"
                      label="e.g. Single-user, Family"
                      value={tempInput.licenseType}
                      onChange={(e) => setTempInput((p) => ({ ...p, licenseType: e.target.value }))}
                      helperText={errors.licenseType}
                      error={Boolean(errors.licenseType)}
                      sx={{ flex: 1 }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addLicenseType();
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addLicenseType}
                      style={{ color: "black" }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    {service.accessLicenseTypes.map((lt, i) => (
                      <Box
                        key={lt + i}
                        sx={{
                          px: 1,
                          py: 0.4,
                          borderRadius: 1,
                          border: "1px solid rgba(0,0,0,0.06)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <MDTypography variant="caption">{lt}</MDTypography>
                        <IconButton size="small" onClick={() => removeLicenseType(i)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Video-only Quality (optional)"
                        name="videoQuality"
                        value={service.videoQuality}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Price"
                        name="price"
                        value={service.price}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(errors.price)}
                        helperText={errors.price}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Discounted Price (optional)"
                        name="discountedPrice"
                        value={service.discountedPrice}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(errors.discountedPrice)}
                        helperText={errors.discountedPrice}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ color: "#FFFFFF", height: 48 }}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={18} /> : "Save Changes"}
                    </Button>

                    <Button variant="outlined" onClick={() => navigate(-1)} sx={{ height: 48 }}>
                      Cancel
                    </Button>
                  </Box>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
