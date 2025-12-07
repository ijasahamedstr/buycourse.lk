import React from "react";
import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
} from "@mui/material";
import { Facebook, Instagram, Email, Phone } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Footer: React.FC = () => {
  const categories = [
    { label: "Tamil Courses", to: "/tamil-courses" },
    { label: "Sinhala Courses", to: "/sinhala-courses" },
    { label: "English Courses", to: "/english-courses" },
    { label: "Premium Account Service", to: "/premium-account-service" },
  ];

  return (
    <Box component="footer" sx={{ fontFamily: '"Montserrat", sans-serif' }}>
      {/* Main Footer Section */}
      <Box
        sx={{
          backgroundColor: "#7a7676",
          color: "#fff",
          py: { xs: 5, sm: 6 },
          px: { xs: 2, sm: 4 },
          fontFamily: '"Montserrat", sans-serif',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "flex-start" },
              gap: 4,
              textAlign: { xs: "center", md: "left" },
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            {/* Logo & Social Icons */}
            <Box
              sx={{
                flexBasis: { xs: "100%", md: "25%" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              {/* ⭐ Bigger Logo */}
              <Box
                component="img"
                src="https://i.ibb.co/9mjM4F3T/Gemini-Generated-Image-ot0pq8ot0pq8ot0p-removebg-preview.png"
                alt="Vater Logo"
                sx={{
                  width: { xs: 200, sm: 220, md: 240 },
                  height: "auto",
                  mb: 2,
                }}
              />

              <Typography
                variant="body2"
                sx={{ fontWeight: 500, mb: 1, fontFamily: '"Montserrat", sans-serif' }}
              >
                Connect with us
              </Typography>

              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                {[
                  { icon: <Phone />, link: "#" },
                  { icon: <Email />, link: "#" },
                  { icon: <Facebook />, link: "https://facebook.com" },
                  { icon: <Instagram />, link: "https://instagram.com" },
                ].map((item, index) => (
                  <IconButton
                    key={index}
                    href={item.link}
                    target="_blank"
                    sx={{
                      color: "#fff",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      "&:hover": {
                        backgroundColor: "#fff",
                        color: "#000",
                        transform: "scale(1.1)",
                      },
                      width: 34,
                      height: 34,
                    }}
                  >
                    {item.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                borderColor: "rgba(255,255,255,0.2)",
              }}
            />

            {/* Categories (NO heading, NO text center) */}
            <Box
              sx={{
                flexBasis: { xs: "100%", md: "25%" },
                textAlign: "left",
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.8,
                  alignItems: "flex-start",
                }}
              >
                {categories.map((cat) => (
                  <MuiLink
                    key={cat.label}
                    component={RouterLink}
                    to={cat.to}
                    underline="hover"
                    color="inherit"
                    sx={{
                      fontSize: "0.9rem",
                      "&:hover": { color: "#cce5ff" },
                      fontFamily: '"Montserrat", sans-serif',
                    }}
                  >
                    {cat.label}
                  </MuiLink>
                ))}
              </Box>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                borderColor: "rgba(255,255,255,0.2)",
              }}
            />

            {/* Contact */}
            <Box
              sx={{
                flexBasis: { xs: "100%", md: "25%" },
                textAlign: { xs: "center", md: "left" },
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#0C0A09",
                  fontFamily: '"Montserrat", sans-serif',
                }}
              >
                CONTACT
              </Typography>

              <Typography
                variant="body2"
                sx={{ lineHeight: 1.7, fontFamily: '"Montserrat", sans-serif' }}
              >
                (+94) 76 708 0553
                <br />
                <MuiLink
                  href="mailto:info@buycourse.lk"
                  underline="hover"
                  color="inherit"
                  sx={{
                    "&:hover": { color: "#cce5ff" },
                    fontFamily: '"Montserrat", sans-serif',
                  }}
                >
                  info@buycourse.lk
                </MuiLink>
              </Typography>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                borderColor: "rgba(255,255,255,0.2)",
              }}
            />

            {/* Opening Hours */}
            <Box
              sx={{
                flexBasis: { xs: "100%", md: "25%" },
                textAlign: { xs: "center", md: "left" },
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#0C0A09",
                  fontFamily: '"Montserrat", sans-serif',
                }}
              >
                OPENING HOURS
              </Typography>

              <Typography
                variant="body2"
                sx={{ lineHeight: 1.7, fontFamily: '"Montserrat", sans-serif' }}
              >
                Saturday - Friday
                <br />
                8:00 am to 12:00 pm
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bottom Footer Bar */}
      <Box sx={{ backgroundColor: "#000", py: 2, fontFamily: '"Montserrat", sans-serif' }}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            textAlign: "center",
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#fff", fontSize: "0.85rem", fontFamily: '"Montserrat", sans-serif' }}
          >
            Copyright © 2026 | buycourse.lk. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
