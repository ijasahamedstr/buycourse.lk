import React from "react";
import {
  Box,
  Container,
  Typography,
} from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Bottom Section */}
      <Box sx={{ backgroundColor: "#28282B", py: 2 }}>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            sx={{
              fontSize: "1rem",
              textAlign: "center",
              color: "#fff",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            &copy; {new Date().getFullYear()} buycourse.lk. All rights
            reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
