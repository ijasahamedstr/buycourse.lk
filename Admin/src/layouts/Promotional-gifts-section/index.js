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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Import Ant Design's Image and PreviewGroup components
import { Image } from "antd";

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

function Promotionalgiftssection() {
  const [promotionalGifts, setPromotionalGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/Promotionalgifts`);
        setPromotionalGifts(response.data); // Set the fetched gifts
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Define the columns for the DataTable
  const columns = [
    { Header: "Gift Name", accessor: "Gift_Name", width: "20%", align: "left" },
    { Header: "Gift Type", accessor: "Gift_Type", width: "20%", align: "left" },
    { Header: "Gift Image", accessor: "Gift_Image", align: "center" },
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
        await axios.delete(`${process.env.REACT_APP_API_HOST}/Promotionalgifts/${id}`);
        setPromotionalGifts(promotionalGifts.filter((gift) => gift._id !== id));
        Swal.fire("Deleted!", "The gift has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting gift: ", err);
        Swal.fire("Error!", "There was an issue deleting the gift.", "error");
      }
    }
  };

  // Map through promotional gifts data to build table rows
  const rows = promotionalGifts.map((item) => ({
    Gift_Name: (
      <Author
        name={item.giftname}
        style={{ fontFamily: "Tajawal, sans-serif", fontSize: "18px" }}
      />
    ),
    Gift_Type: (
      <Author
        name={item.gifttype}
        style={{ fontFamily: "Tajawal, sans-serif", fontSize: "18px" }}
      />
    ),
    Gift_Image: (
      <MDBox>
        {item.gifttimage ? (
          <Image.PreviewGroup>
            <Image
              src={`${process.env.REACT_APP_API_HOST}/uploads/Promotionalgifts/${item.gifttimage}`}
              alt="Gift"
              style={{ maxWidth: "100px", borderRadius: "8px" }}
            />
          </Image.PreviewGroup>
        ) : (
          <Image
            src="https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg"
            alt="No Image"
            style={{ maxWidth: "50px", borderRadius: "8px" }}
          />
        )}
      </MDBox>
    ),
    action: (
      <MDBox display="flex" justifyContent="center" alignItems="center" gap={2}>
        {/* Edit button */}
        <Link
          to={`/Edit-Promotional-gifts-section/${item._id}`}
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
                  Promotional Gifts Table
                </MDTypography>
                <Link to="/Add-Promotional-gifts-section">
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
                  isSorted={false}
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

export default Promotionalgiftssection;
