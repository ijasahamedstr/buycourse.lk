// src/pages/Programmes.tsx
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Button, CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

type PlanHeading = {
  planDurations?: string;
  Price?: string | number;
};

type Course = {
  id: string;
  title: string;
  price?: string | number;
  discountedPrice?: string | number;
  duration?: string;
  image: string;
  description: string;
  category?: string;
  demoVideo?: string;
  mainHeadings?: PlanHeading[];
  instructor?: string;
  coursedemovideolink?: string;
  date?: string;
  accessLicenseTypes?: string[];
  videoQuality?: string;
  stock?: number;
};

const FALLBACK_COURSES: Course[] = [
  {
    id: "tamil-101",
    title: "Tamil Language — Beginner",
    price: "3,499",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80",
    description: "Start speaking Tamil confidently.",
    category: "tamil",
  },
  {
    id: "tamil-advanced",
    title: "Tamil Conversation — Intermediate",
    price: "4,499",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80",
    description: "Practice real-life Tamil conversations.",
    category: "tamil",
  },
  {
    id: "sinhala-101",
    title: "Sinhala Essentials",
    price: "3,499",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    description: "Essential Sinhala for beginners.",
    category: "sinhala",
  },
  {
    id: "english-communication",
    title: "English Communication Mastery",
    price: "4,999",
    duration: "4 months",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80",
    description: "Improve speaking and writing skills.",
    category: "english",
  },
];

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");

const truncate = (text: string | undefined, max = 100) => {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > max ? cleaned.slice(0, max).trim() + "…" : cleaned;
};

const Premiumaccounthome: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>(FALLBACK_COURSES);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [dbEmpty, setDbEmpty] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);

    let rellaxInstance: any = null;
    if (typeof window !== "undefined") {
      (async () => {
        try {
          const mod = await import("rellax");
          const Rellax = mod?.default || mod;
          rellaxInstance = new Rellax(".rellax", { speed: -2 });
        } catch (err) {
          // noop if rellax isn't installed
        }
      })();
    }

    const fetchCourses = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_API_HOST}/Ottservice`);
        const data = resp.data;

        let items: any[] = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data?.data)) items = data.data;
        else if (Array.isArray(data?.rows)) items = data.rows;
        else if (data && typeof data === "object") {
          const firstArray = Object.values(data).find((v) => Array.isArray(v));
          items = Array.isArray(firstArray) ? firstArray : [];
        }

        if (!items || items.length === 0) {
          setDbEmpty(true);
          setError("");
          setCourses(FALLBACK_COURSES);
          return;
        }

        const mapped: Course[] = items.map((item: any, idx: number) => {
          const id = (
            item.id ??
            item._id ??
            item.ottServiceId ??
            item.serviceId ??
            `ott-${idx}`
          ).toString();

          const title =
            item.ottServiceName ??
            item.title ??
            item.name ??
            `Service ${idx + 1}`;

          const description =
            item.description ??
            item.courseDescription ??
            item.summary ??
            "";

          // price & discounted price
          const discountedPrice =
            item.discountedPrice ?? item.offerPrice ?? undefined;
          const price =
            item.price ??
            item.Price ??
            item.coursePrice ??
            undefined;

          // images: can be array of strings or objects
          let image = "";
          if (Array.isArray(item.images) && item.images.length > 0) {
            const first = item.images[0];
            image = first?.url ?? first?.src ?? first ?? "";
          } else {
            image =
              item.courseImage ??
              item.image ??
              item.imageUrl ??
              item.image_url ??
              item.photo ??
              "";
          }

          // accessLicenseTypes: string[] or CSV
          let accessLicenseTypes: string[] = [];
          if (Array.isArray(item.accessLicenseTypes)) {
            accessLicenseTypes = item.accessLicenseTypes;
          } else if (typeof item.accessLicenseTypes === "string") {
            accessLicenseTypes = item.accessLicenseTypes
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
          }

          const videoQuality: string | undefined = item.videoQuality ?? undefined;

          // mainHeadings: [{ planDurations, Price }]
          const mainHeadings: PlanHeading[] = Array.isArray(item.mainHeadings)
            ? item.mainHeadings.map((p: any) => ({
                planDurations: p.planDurations ?? p.duration ?? p.planDuration,
                Price: p.Price ?? p.price ?? p.amount,
              }))
            : [];

          const category: string =
            item.category ??
            item.serviceCategory ??
            "OTT";

          const stock: number | undefined =
            typeof item.stock === "number" ? item.stock : undefined;

          return {
            id,
            title,
            price,
            discountedPrice,
            duration: undefined, // not used in OTT, but kept for compatibility
            image: image || "",
            description,
            category,
            demoVideo: item.coursedemovideolink ?? item.demo ?? item.demoLink,
            mainHeadings,
            instructor: item.instructor ?? item.tutor ?? item.teacher ?? "TBA",
            coursedemovideolink:
              item.coursedemovideolink ?? item.demo ?? item.demoLink,
            date: item.date ?? "",
            accessLicenseTypes,
            videoQuality,
            stock,
          };
        });

        const valid = mapped.filter((m) => m.title);
        if (valid.length === 0) {
          setDbEmpty(true);
          setCourses(FALLBACK_COURSES);
        } else {
          setCourses(valid);
        }
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError("Unable to fetch OTT services from server. Showing default courses.");
        setCourses(FALLBACK_COURSES);
      } finally {
        setTimeout(() => setLoading(false), 150);
      }
    };

    fetchCourses();

    return () => {
      if (rellaxInstance && typeof rellaxInstance.destroy === "function")
        rellaxInstance.destroy();
    };
  }, []);

  // 🔁 UPDATED: navigate to /service/:slug
  const handleSlideClick = (course: Course) => {
    const slug = slugify(course.id || course.title);
    navigate(`/service/${slug}`);
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
            sx={{
              fontWeight: 700,
              color: "#0a5397",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {title}
          </Typography>

          <Typography
            component="button"
            onClick={() => navigate(viewMorePath)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
            sx={{
              color: "#0a5397",
              fontWeight: 700,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.95rem",
            } as any}
          >
            View all OTT services →
          </Typography>
        </Box>

        {mounted && (
          <Swiper
            spaceBetween={20}
            slidesPerView={1.05}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            breakpoints={{
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
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
                      boxShadow: 3,
                      backgroundColor: "#fff",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      textAlign: "left",
                      px: 2,
                      py: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 340,
                        height: 200,
                        borderRadius: 2,
                        overflow: "hidden",
                        mt: 0,
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
                    </Box>

                    <Box sx={{ py: 1.2, px: 0, width: "100%", maxWidth: 340 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.95rem",
                        }}
                      >
                        {course.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.4,
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.8rem",
                        }}
                      >
                        {truncate(course.description, 90)}
                      </Typography>

                      {/* price + discounted price */}
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          fontWeight: 700,
                          color: "#0a5397",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.85rem",
                        }}
                      >
                        {course.discountedPrice
                          ? `Price: LKR ${course.discountedPrice} (was LKR ${course.price})`
                          : course.price
                          ? `Price: LKR ${course.price}`
                          : "Price: —"}
                      </Typography>

                      {course.videoQuality && (
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            display: "block",
                            fontFamily: "'Montserrat', sans-serif",
                            color: "text.secondary",
                          }}
                        >
                          Quality: {course.videoQuality}
                        </Typography>
                      )}
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
                      alignItems: "flex-start",
                      textAlign: "left",
                      px: 3,
                      boxShadow: 4,
                      py: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "1rem",
                        }}
                      >
                        {course.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          lineHeight: 1.6,
                          maxWidth: 280,
                          fontFamily: "'Montserrat', sans-serif",
                          opacity: 0.95,
                          fontSize: "0.85rem",
                        }}
                      >
                        {truncate(course.description, 110)}
                      </Typography>

                      {/* Plan durations & prices (first 2 plans) */}
                      {course.mainHeadings && course.mainHeadings.length > 0 && (
                        <Box sx={{ mt: 1.5 }}>
                          {course.mainHeadings.slice(0, 2).map((plan, idx) => (
                            <Typography
                              key={idx}
                              variant="caption"
                              sx={{
                                display: "block",
                                fontFamily: "'Montserrat', sans-serif",
                                opacity: 0.9,
                              }}
                            >
                              {plan.planDurations
                                ? `${plan.planDurations} – LKR ${plan.Price}`
                                : `Plan ${idx + 1} – LKR ${plan.Price}`}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>

                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-start",
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          const slug = slugify(course.id || course.title);
                          // 🔁 UPDATED: View button goes to /service/:slug
                          navigate(`/service/${slug}`);
                        }}
                        sx={{
                          backgroundColor: "#fff",
                          color: "#0a5397",
                          fontWeight: 700,
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          "&:hover": { backgroundColor: "#f3f3f3" },
                          fontSize: "0.85rem",
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
    <Box
      sx={{
        backgroundColor: "#f9fbff",
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        className="rellax"
        data-rellax-speed="-2"
        sx={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          backgroundColor: "#cce4ff",
          zIndex: 0,
        }}
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
          OTT Services
        </Typography>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#0a5397",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Popular OTT Programmes
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error ? (
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="body1" color="error" sx={{ mb: 1 }}>
                  {error}
                </Typography>
                <Button onClick={() => navigate("/premium-account-service")} variant="outlined">
                  View all OTT services
                </Button>
              </Box>
            ) : dbEmpty ? (
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  No OTT services found in the database — showing default courses.
                </Typography>
                <Button onClick={() => navigate("/premium-account-service")} variant="outlined">
                  View all OTT services
                </Button>
              </Box>
            ) : null}

            {/* ✅ Single slider showing ALL Ottservice items */}
            {renderSection("All OTT Services", courses, "/premium-account-service")}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Premiumaccounthome;
