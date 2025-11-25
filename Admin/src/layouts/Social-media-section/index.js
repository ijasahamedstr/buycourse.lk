import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import { Image } from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Helper component for displaying Author information
const Author = ({ name, style }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDBox ml={2} lineHeight={1}>
      <MDTypography variant="button" fontWeight="medium" style={style}>
        {name}
      </MDTypography>
    </MDBox>
  </MDBox>
);

Author.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
};

// Helper component for displaying Job information
const Job = ({ title }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography variant="caption" color="text" fontWeight="medium">
      {title}
    </MDTypography>
  </MDBox>
);

Job.propTypes = {
  title: PropTypes.string.isRequired,
};

function Socialmediasection() {
  const [Socialmedia, setSocialmedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/Socialmedia`);
      setSocialmedia(response.data); // Set the fetched screens
    } catch (err) {
      console.error("Error fetching data: ", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Snackbar open={true} message={error} />;

  // Define the columns for the DataTable
  const columns = [
    { Header: "soicalmedia Name", accessor: "soicalmedia_Name", width: "20%", align: "left" },
    {
      Header: "soicalmedia Main Type",
      accessor: "soicalmedia_Main_Type",
      width: "20%",
      align: "left",
    },
    {
      Header: "soicalmedia Sub Type",
      accessor: "soicalmedia_Sub_Type",
      width: "20%",
      align: "left",
    },
    { Header: "soicalmedia Image", accessor: "soicalmedia_Image", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  // Handle delete action with SweetAlert2 confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_HOST}/Socialmedia/${id}`);
        // Re-fetch data after delete to update state
        fetchData();
        Swal.fire("Deleted!", "The Screen has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting Screen: ", err);
        Swal.fire("Error!", "There was an issue deleting the Screen.", "error");
      }
    }
  };

  // Map through promotional gifts data to build table rows
  const rows = Socialmedia.map((item) => ({
    soicalmedia_Name: (
      <Author
        name={item.soicalmedianame}
        style={{ fontFamily: "Tajawal, sans-serif", fontSize: "18px" }}
      />
    ),
    soicalmedia_Main_Type: (
      <Author
        name={item.soicalmediamaintype}
        style={{ fontFamily: "Tajawal, sans-serif", fontSize: "18px" }}
      />
    ),
    soicalmedia_Sub_Type: (
      <Author
        name={item.soicalmediasubtype}
        style={{ fontFamily: "Tajawal, sans-serif", fontSize: "18px" }}
      />
    ),
    soicalmedia_Image: (
      <MDBox>
        <Image.PreviewGroup>
          {item.Soicalmediaimage && item.Soicalmediaimage.length > 0 ? (
            item.Soicalmediaimage.map((image, index) => (
              <Image
                key={index}
                width={150}
                height={100} // Ensure the height is also fixed
                src={`${process.env.REACT_APP_API_HOST}/uploads/Socialmedia/${image}`}
                alt={`User Profile ${index}`}
                style={{ objectFit: "cover" }} // Ensures uniform aspect ratio
              />
            ))
          ) : (
            <Image
              width={100}
              height={50} // Placeholder image also has fixed size
              src="https://via.placeholder.com/200"
              alt="No images available"
              style={{ objectFit: "cover" }} // Placeholder image style
            />
          )}
        </Image.PreviewGroup>
      </MDBox>
    ),
    action: (
      <MDBox display="flex" justifyContent="center" alignItems="center" gap={2}>
        {/* Edit button */}
        <Link
          to={`/Edit-Socialmediasection/${item._id}`}
          style={{ textDecoration: "none" }} // Ensure no style interference
        >
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<EditIcon sx={{ marginRight: "4px" }} />}
            sx={{
              backgroundColor: "#3f51b5",
              color: "white",
              "&:hover": { backgroundColor: "#303f9f" },
              padding: "6px 10px",
            }}
          >
            Edit
          </Button>
        </Link>

        {/* Delete button */}
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(item._id)}
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": { backgroundColor: "#ff4d4d" },
            padding: "6px 10px",
          }}
        >
          Delete
        </Button>
      </MDBox>
    ),
  }));

  // Handle the 'Add New' button click
  const handleNewFieldClick = () => {
    console.log("New Field button clicked");
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
                  Social media section Table
                </MDTypography>
                <Link to="/Add-Socialmediasection">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNewFieldClick}
                    size="small"
                    startIcon={<AddIcon />}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      color: "black",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    Add New
                  </Button>
                </Link>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true} // Enable sorting
                  entriesPerPage={5}
                  showTotalEntries={true}
                  pagination
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Socialmediasection;
