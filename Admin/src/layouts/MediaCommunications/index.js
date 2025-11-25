import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

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

function MediaCommunicationsSection() {
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
                  Media Communications
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={2} // Adds space between the buttons
                  mb={4} // Adds margin to the bottom (30px equivalent in Material-UI's spacing scale, 1 unit = 8px)
                >
                  {/* Photo Section Button with blue background */}
                  <Link to="/MediaCommunications-photo-section" style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      size="medium" // Set button size to medium
                      sx={{
                        padding: "12px 24px", // Adjust padding for medium button size
                        fontSize: "1rem", // Adjust font size for medium size
                        backgroundColor: "#17202a", // Blue background color
                        color: "white", // White text color
                        "&:hover": {
                          backgroundColor: "#17202a", // Dark blue on hover
                        },
                      }}
                    >
                      Photo Section
                    </Button>
                  </Link>

                  {/* Video Section Button with green background */}
                  <Link to="/MediaCommunications-video-section" style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      size="medium" // Set button size to medium
                      sx={{
                        padding: "12px 24px", // Adjust padding for medium button size
                        fontSize: "1rem", // Adjust font size for medium size
                        backgroundColor: "#17202a", // Green background color
                        color: "white", // White text color
                        "&:hover": {
                          backgroundColor: "#17202a", // Dark green on hover
                        },
                      }}
                    >
                      Video Section
                    </Button>
                  </Link>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default MediaCommunicationsSection;
