import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import { Facebook, Instagram, Email, Phone } from "@mui/icons-material";

const Footer: React.FC = () => {
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
              {/* ⭐ Updated Bigger Logo */}
              <Box
                component="img"
                src="https://i.ibb.co/9mjM4F3T/Gemini-Generated-Image-ot0pq8ot0pq8ot0p-removebg-preview.png"
                alt="Vater Logo"
                sx={{
                  width: { xs: 200, sm: 220, md: 240 }, // Bigger responsive logo
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

            {/* Address */}
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
                ADDRESS
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.7,
                  mx: { xs: "auto", md: 0 },
                  maxWidth: 260,
                  fontFamily: '"Montserrat", sans-serif',
                }}
              >
               Galadari Hotel, 64 Lotus Rd, Colombo 01, Sri Lanka
                <br />
                P.O.BOX 05551,
                <br />
                Tel: (+94) 76 708 0553,
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
                <Link
                  href="mailto:info@buycourse.lk"
                  underline="hover"
                  color="inherit"
                  sx={{
                    "&:hover": { color: "#cce5ff" },
                    fontFamily: '"Montserrat", sans-serif',
                  }}
                >
                  info@buycourse.lk
                </Link>{" "}
      
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
                Saturday - Thursday
                <br />
                8:00 am to 6:00 pm
                <br />
                Friday Closed.
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
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            textAlign: { xs: "center", sm: "center" },
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#fff", fontSize: "0.85rem", fontFamily: '"Montserrat", sans-serif' }}
          >
            Copyright © 2026 | buycourse.lk. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              flexWrap: "wrap",
              justifyContent: "flex-end",
              alignItems: "center",
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            {["Home", "Tamil Courses", "Sinhala Courses", "English Courses","Premium Account Service"].map(
              (text, index, array) => (
                <React.Fragment key={text}>
                  <Link
                    href="#"
                    underline="hover"
                    color="#FFF"
                    sx={{
                      fontSize: "0.85rem",
                      "&:hover": { color: "#cce5ff" },
                      fontFamily: '"Montserrat", sans-serif',
                    }}
                  >
                    {text}
                  </Link>
                  {index < array.length - 1 && (
                    <Typography
                      component="span"
                      sx={{
                        mx: 1,
                        color: "#FFF",
                        fontSize: "0.85rem",
                      }}
                    >
                      |
                    </Typography>
                  )}
                </React.Fragment>
              )
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
