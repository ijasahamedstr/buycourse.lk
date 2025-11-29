import React, { useState } from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Rating,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Pass a `course` prop with fields including `coursedemovideolink` (string).
type CourseProps = {
  course?: {
    courseName?: string;
    courseDescription?: string;
    coursePrice?: string | number;
    duration?: string;
    courseImage?: string;
    mainHeadings?: string[];
    courseCategory?: string;
    coursedemovideolink?: string;
    date?: string;
  };
};

export default function CoursePage({ course }: CourseProps) {
  const font = "'Montserrat', sans-serif";
  const [openModules, setOpenModules] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);

  const {
    courseName = "Lyceum Global — Foundation in Business",
    courseDescription = `The Lyceum Global Foundation in Business program is an internationally
      recognized pre-university qualification that prepares students for higher education
      in Business & Management.`,
    coursePrice = "$299",
    duration: courseDuration = "8 months",
    courseImage = "https://i.ibb.co/m5WnyvxK/Gemini-Generated-Image-yeqnwvyeqnwvyeqn.png",
    mainHeadings = ["Foundation in Business overview", "Entry requirements", "Pathways & partners"],
    courseCategory = "Business & Management",
    coursedemovideolink = "",
    date = "",
  } = course ?? {};

  const modules = [
    { title: "Academic English", duration: "22 mins" },
    { title: "Essentials Of Computing", duration: "44 mins" },
    { title: "Mathematics I", duration: "26 mins" },
    { title: "Professional Communication", duration: "29 mins" },
    { title: "Understanding Organizations", duration: "56 mins" },
    { title: "Introduction To Economics", duration: "55 mins" },
    { title: "Principles Of Marketing", duration: "42 mins" },
    { title: "Introduction To Accounting", duration: "34 mins" },
  ];

  const modulesSubdomain = courseCategory;

  const toggleModule = (idx: number) => {
    setOpenModuleIndex((prev) => (prev === idx ? null : idx));
  };

  // Helpers to detect video type and convert YouTube URLs to embed
  const isYouTube = (url: string) =>
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(url);
  const getYouTubeEmbed = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed${u.pathname}`;
      }
      if (u.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      }
      if (url.includes("/embed/")) return url;
      return url;
    } catch {
      return url;
    }
  };
  const isVideoFile = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

  return (
    // Removed top spacing: ensure wrapper has no top padding
    <Box sx={{ bgcolor: "#fff", fontFamily: font, pt: 0 }}>
      {/* DEMO VIDEO (renders only when link provided) */}
      {coursedemovideolink ? (
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, mt: 0 }}>
          <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 700, mb: 1, fontFamily: font }}>Course demo</Typography>

              {/* YouTube embed */}
              {isYouTube(coursedemovideolink) ? (
                <Box sx={{ position: "relative", pt: "56.25%" /* 16:9 */ }}>
                  <iframe
                    title="Course demo"
                    src={getYouTubeEmbed(coursedemovideolink)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
              ) : isVideoFile(coursedemovideolink) ? (
                <Box>
                  <video controls src={coursedemovideolink} style={{ width: "100%", borderRadius: 6 }} />
                </Box>
              ) : (
                <Typography variant="body2">
                  Demo video:&nbsp;
                  <Link href={coursedemovideolink} target="_blank" rel="noreferrer">
                    Open demo in new tab
                  </Link>
                </Typography>
              )}
            </Box>
          </Card>
        </Box>
      ) : null}

      {/* BREADCRUMB */}
      <Box sx={{ bgcolor: "#f3f6fb", py: 2, mt: 0 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Breadcrumbs separator="›" sx={{ fontFamily: font }}>
            <Link href="#" style={{ fontFamily: font }}>
              Home
            </Link>
            <Link href="#" style={{ fontFamily: font }}>
              Programs
            </Link>
            <Typography color="text.primary" sx={{ fontFamily: font }}>
              {courseName}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* MAIN CONTENT */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "flex-start",
            fontFamily: font,
          }}
        >
          {/* LEFT */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent sx={{ fontFamily: font }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontFamily: font }}>
                  {courseName}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    fontFamily: font,
                  }}
                >
                  <Rating value={4.6} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    4.6 (2,315 ratings)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    • {courseDuration} • {date || "Intakes: March & September"}
                  </Typography>
                </Box>

                <Typography sx={{ mb: 2, fontFamily: font }}>{courseDescription}</Typography>

                <Divider sx={{ my: 2 }} />

                {/* MODULES heading + subheading + chip */}
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: font }}>
                      Modules
                    </Typography>

                    <Chip
                      label={modulesSubdomain}
                      size="small"
                      sx={{
                        bgcolor: "#eef4ff",
                        color: "#1E4CA1",
                        fontWeight: 600,
                        fontFamily: font,
                      }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    Core module list — organized by subject area and sequence
                  </Typography>
                </Box>

                {/* Modules container card */}
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                    fontFamily: font,
                  }}
                >
                  {/* Header row — label only */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f7faff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 16, fontFamily: font }}>
                      01 Modules Preview
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                        {modules.length} items
                      </Typography>
                      <IconButton
                        aria-expanded={openModules}
                        aria-label={openModules ? "Collapse modules" : "Expand modules"}
                        size="small"
                        onClick={() => setOpenModules((s) => !s)}
                        sx={{
                          transform: openModules ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 200ms ease",
                        }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Collapsible full list */}
                  <Collapse in={openModules} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 0 }}>
                      {modules.map((m, i) => {
                        const isOpen = openModuleIndex === i;
                        return (
                          <Box key={i}>
                            {/* Module row */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                py: 1.25,
                                px: 2,
                                borderBottom:
                                  i < modules.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                                cursor: "pointer",
                              }}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleModule(i)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") toggleModule(i);
                              }}
                            >
                              <Box>
                                <Typography sx={{ fontWeight: 600, fontFamily: font }}>{m.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                                  Module overview • {m.duration}
                                </Typography>
                              </Box>

                              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <Chip
                                  label={`Module ${i + 1}`}
                                  size="small"
                                  sx={{
                                    bgcolor: "#e8f0ff",
                                    color: "#1E4CA1",
                                    fontWeight: 600,
                                    fontSize: 12,
                                    fontFamily: font,
                                  }}
                                />

                                <IconButton
                                  size="small"
                                  aria-label={isOpen ? "Collapse section" : "Expand section"}
                                  sx={{
                                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 150ms ease",
                                  }}
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                              </Box>
                            </Box>

                            {/* Per-module collapse: lessons/resources */}
                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 2, bgcolor: "#fbfdff" }}>
                                <Typography sx={{ fontWeight: 600, mb: 1, fontFamily: font }}>
                                  {m.title} — Section
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontFamily: font }}>
                                  Module duration: {m.duration}
                                </Typography>

                                <Box sx={{ display: "grid", gap: 1 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      py: 1,
                                      px: 1,
                                      borderRadius: 1,
                                      bgcolor: "#fff",
                                      boxShadow: 0,
                                    }}
                                  >
                                    <Box>
                                      <Typography sx={{ fontWeight: 600, fontSize: 14, fontFamily: font }}>
                                        Lecture — Introduction
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                                        8:12
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                                      8:12
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      py: 1,
                                      px: 1,
                                      borderRadius: 1,
                                      bgcolor: "#fff",
                                    }}
                                  >
                                    <Box>
                                      <Typography sx={{ fontWeight: 600, fontSize: 14, fontFamily: font }}>
                                        Lecture — Key Concepts
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                                        12:34
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                                      12:34
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Collapse>
                          </Box>
                        );
                      })}
                    </Box>
                  </Collapse>
                </Card>

                <Divider sx={{ my: 2 }} />

                {/* ADDITIONAL INFO (uses mainHeadings array) */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: font }}>
                  Additional Info
                </Typography>

                <Typography sx={{ mb: 1, fontFamily: font }}>{courseDescription}</Typography>

                {mainHeadings && mainHeadings.length > 0 && (
                  <List dense>
                    {mainHeadings.map((h, i) => (
                      <ListItem key={i} sx={{ pl: 0 }}>
                        <ListItemText primary={h} primaryTypographyProps={{ fontFamily: font }} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* RIGHT - sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: 360 },
              flexShrink: 0,
              position: { md: "sticky" },
              top: { md: 24 },
              fontFamily: font,
            }}
          >
            <Card sx={{ borderRadius: 2, boxShadow: 6 }}>
              <CardMedia component="img" height="180" image={courseImage} alt="Course preview" />
              <CardContent sx={{ fontFamily: font }}>
                <Typography sx={{ fontWeight: 700, mb: 1, fontFamily: font }}>
                  {typeof coursePrice === "number" ? `$${coursePrice}` : coursePrice}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                  One-time fee • Scholarship up to 50% available
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#1b3b84",
                    textTransform: "none",
                    py: 1.2,
                    fontFamily: font,
                    "&:hover": { backgroundColor: "#162e6b" },
                  }}
                >
                  Add to cart
                </Button>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontFamily: font }}>Certificate of Completion</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                      Recognized by Lyceum Campus
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 2, p: 2, fontFamily: font }}>
              <Typography sx={{ fontWeight: 700, mb: 1, fontFamily: font }}>Course Details</Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                Duration: {courseDuration}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                Category: {courseCategory}
              </Typography>
              {date && (
                <Typography variant="body2" sx={{ fontFamily: font }}>
                  Date: {date}
                </Typography>
              )}
              {coursedemovideolink && !isYouTube(coursedemovideolink) && !isVideoFile(coursedemovideolink) && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Demo: <Link href={coursedemovideolink} target="_blank" rel="noreferrer">Open</Link>
                </Typography>
              )}
            </Card>
          </Box>
        </Box>
      </Box>

      {/* (footer removed per request) */}
    </Box>
  );
}
