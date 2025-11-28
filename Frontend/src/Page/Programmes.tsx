// Programmes.tsx
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

// Swiper CSS (import once per app or per component)
import "swiper/css";
import "swiper/css/pagination";

type Course = {
  id: string;
  title: string;
  instructor: string;
  price?: string;
  duration?: string;
  image: string;
  description: string;
  category?: "tamil" | "sinhala" | "english" | "other";
};

// sample course data — ensure ids are unique in your real data
const courses: Course[] = [
  {
    id: "tamil-101",
    title: "Tamil Language — Beginner",
    instructor: "Prof. Ananda",
    price: "LKR 3,499",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80",
    description: "Start speaking Tamil confidently.",
    category: "tamil",
  },
  {
    id: "tamil-advanced",
    title: "Tamil Conversation — Intermediate",
    instructor: "Ms. Kavya",
    price: "LKR 4,499",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80",
    description: "Practice real-life Tamil conversations.",
    category: "tamil",
  },

  {
    id: "sinhala-101",
    title: "Sinhala Essentials",
    instructor: "Dr. Malini",
    price: "LKR 3,499",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    description: "Essential Sinhala for beginners.",
    category: "sinhala",
  },
  {
    id: "sinhala-convo",
    title: "Sinhala Conversation",
    instructor: "Ms. Nadeesha",
    price: "LKR 3,999",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    description: "Interactive Sinhala classes.",
    category: "sinhala",
  },

  {
    id: "english-communication",
    title: "English Communication Mastery",
    instructor: "Ms. Sarah Johnson",
    price: "LKR 4,999",
    duration: "4 months",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80",
    description: "Improve speaking and writing skills.",
    category: "english",
  },
  {
    id: "english-business",
    title: "Business English",
    instructor: "Mr. Arjun",
    price: "LKR 5,499",
    duration: "4 months",
    image:
      "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1600&q=80",
    description: "Professional English for meetings.",
    category: "english",
  },

  {
    id: "premium-account",
    title: "Premium Account Service",
    instructor: "Support Team",
    price: "LKR 12,999 / year",
    duration: "12 months",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80",
    description: "Premium access & mentoring.",
    category: "other",
  },
];

// safe slugify
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");

// filtering by category (explicit field is more reliable)
const tamilCourses = courses.filter((c) => c.category === "tamil");
const sinhalaCourses = courses.filter((c) => c.category === "sinhala");
const englishCourses = courses.filter((c) => c.category === "english");

const Programmes: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // mark mounted so Swiper renders client-side
    setMounted(true);

    // dynamic import Rellax safely (works even if not installed)
    let rellaxInstance: any = null;
    if (typeof window !== "undefined") {
      (async () => {
        try {
          const mod = await import("rellax");
          const Rellax = mod?.default || mod;
          // create and keep instance local
          rellaxInstance = new Rellax(".rellax", { speed: -2 });
        } catch (err) {
          // Rellax not installed or failed — no-op
        }
      })();
    }

    return () => {
      if (rellaxInstance && typeof rellaxInstance.destroy === "function") {
        rellaxInstance.destroy();
        rellaxInstance = null;
      }
    };
  }, []);

  const handleSlideClick = (course: Course) => {
    const slug = slugify(course.id || course.title);
    navigate(`/course/${slug}`);
  };

  const renderSection = (title: string, list: Course[], viewMorePath: string) => {
    if (!list.length) return null;
    return (
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#0a5397", fontFamily: "'Montserrat', sans-serif" }}
          >
            {title}
          </Typography>

          <Typography
            component="a"
            href={viewMorePath}
            sx={{
              color: "#0a5397",
              fontWeight: 700,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.95rem",
            }}
          >
            View more courses →
          </Typography>
        </Box>

        {mounted && (
          <Swiper
            spaceBetween={20}
            slidesPerView={1.05}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            breakpoints={{ 600: { slidesPerView: 2 }, 900: { slidesPerView: 3 }, 1200: { slidesPerView: 4 } }}
            modules={[Autoplay, Pagination]}
            style={{ paddingBottom: "30px" }}
          >
            {list.map((course) => (
              <SwiperSlide key={course.id}>
                <Box
                  onClick={() => handleSlideClick(course)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleSlideClick(course);
                  }}
                  sx={{
                    width: "100%",
                    height: 410,
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s",
                    cursor: "pointer",
                    "&:hover": { transform: "rotateY(180deg)" },
                    perspective: "1000px",
                    outline: "none",
                  }}
                >
                  {/* Front */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: 3,
                      backfaceVisibility: "hidden",
                      textAlign: "center",
                      boxShadow: 3,
                      backgroundColor: "#fff",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {/* Image banner with overlay and hover zoom (pure sx) */}
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 340,
                        height: 200,
                        borderRadius: 2,
                        overflow: "hidden",
                        mt: 2,
                        position: "relative",
                        boxShadow: 2,
                        "& .image-bg": {
                          position: "absolute",
                          inset: 0,
                          backgroundImage: () =>
                            `linear-gradient(to bottom, rgba(0,0,0,0.16), rgba(0,0,0,0.02)), url(${course.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "transform 0.6s ease, filter 0.4s ease",
                        },
                        "&:hover .image-bg": {
                          transform: "scale(1.08)",
                          filter: "brightness(0.96)",
                        },
                      }}
                    >
                      <Box className="image-bg" />
                      {/* duration badge */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          backgroundColor: "rgba(255,255,255,0.95)",
                          color: "#0a5397",
                          px: 1.5,
                          py: 0.35,
                          borderRadius: 1,
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      >
                        {course.duration}
                      </Box>
                    </Box>

                    <Box sx={{ py: 2, px: 2, width: "100%", maxWidth: 340 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, fontFamily: "'Montserrat', sans-serif" }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.4, fontFamily: "'Montserrat', sans-serif" }}>
                        {course.instructor} • {course.duration}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 700, color: "#0a5397", fontFamily: "'Montserrat', sans-serif" }}>
                        {course.price}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Back */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: 3,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "linear-gradient(135deg, #0a5397, #123a6a)",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "center",
                      px: 3,
                      boxShadow: 4,
                      py: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: "'Montserrat', sans-serif" }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.6, maxWidth: 280, fontFamily: "'Montserrat', sans-serif", opacity: 0.95 }}>
                        {course.description}
                      </Typography>
                    </Box>

                    <Box sx={{ width: "100%", display: "flex", gap: 2, justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          const slug = slugify(course.id || course.title);
                          navigate(`/course/${slug}/enroll`);
                        }}
                        sx={{
                          backgroundColor: "#fff",
                          color: "#0a5397",
                          fontWeight: 700,
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          "&:hover": { backgroundColor: "#f3f3f3" },
                        }}
                      >
                        Enroll
                      </Button>

                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          const slug = slugify(course.id || course.title);
                          navigate(`/course/${slug}`);
                        }}
                        sx={{
                          borderColor: "rgba(255,255,255,0.3)",
                          color: "#fff",
                          fontWeight: 600,
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ backgroundColor: "#f9fbff", py: { xs: 6, md: 10 }, position: "relative", overflow: "hidden" }}>
      {/* Parallax Soft Blue Circle */}
      <Box
        className="rellax"
        data-rellax-speed="-2"
        sx={{ position: "absolute", top: -120, left: -120, width: 420, height: 420, borderRadius: "50%", backgroundColor: "#cce4ff", zIndex: 0 }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: "text.secondary",
            mb: 1,
            fontWeight: 500,
            fontFamily: "'Montserrat', sans-serif",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Programs
        </Typography>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 6, color: "#0a5397", fontFamily: "'Montserrat', sans-serif" }}>
          Popular Courses
        </Typography>

        {renderSection("Tamil Courses", tamilCourses, "/tamil-courses")}
        {renderSection("Sinhala Courses", sinhalaCourses, "/courses/sinhala")}
        {renderSection("English Courses", englishCourses, "/english-courses")}
      </Container>
    </Box>
  );
};

export default Programmes;
