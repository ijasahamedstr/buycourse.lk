/**
 * ============================================================================
 * COMPONENT: EliteProgrammesUltra (Version 11.0.0)
 * DESCRIPTION: Premium API-Driven Course Intelligence System.
 * TYPOGRAPHY: Strict "Montserrat" implementation.
 * LIBRARIES: MUI, Framer Motion, Swiper, Axios.
 * ============================================================================
 */

import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Container, Typography, Button, CircularProgress, Stack,
  alpha, styled, useTheme, useMediaQuery, Divider
} from "@mui/material";
import {
  TimerOutlined as TimeIcon,
  AutoAwesome as MagicIcon,
  VerifiedUser as VerifiedIcon,
  Language as GlobeIcon,
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Essential External Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

// --- DESIGN TOKENS ---
const MONTSERRAT = '"Montserrat", sans-serif';
const ACCENT = "#0a5397";
const DARK = "#052342";
const GRADIENT_PRIMARY = `linear-gradient(135deg, ${ACCENT} 0%, ${DARK} 100%)`;

// --- STYLED COMPONENTS ---

const MainWrapper = styled(Box)({
  backgroundColor: "#ffffff",
  minHeight: "100vh",
  fontFamily: MONTSERRAT,
  position: "relative",
  overflow: "hidden"
});

const TabButton = styled(motion.button)<{ active: boolean }>(({ active }) => ({
  padding: "14px 28px",
  borderRadius: "50px",
  border: "none",
  background: active ? GRADIENT_PRIMARY : alpha(ACCENT, 0.05),
  color: active ? "#fff" : DARK,
  fontFamily: MONTSERRAT,
  fontSize: "0.85rem",
  fontWeight: 800,
  letterSpacing: "1px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  boxShadow: active ? `0 10px 20px ${alpha(ACCENT, 0.3)}` : "none",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: active ? GRADIENT_PRIMARY : alpha(ACCENT, 0.12),
    transform: "translateY(-2px)"
  }
}));

const CountBadge = styled(Box)<{ active: boolean }>(({ active }) => ({
  padding: "2px 8px",
  borderRadius: "10px",
  background: active ? "rgba(255,255,255,0.2)" : alpha(ACCENT, 0.1),
  fontSize: "0.7rem",
  fontWeight: 900
}));

const PerspectiveCard = styled(motion.div)({
  perspective: "1500px",
  height: 520,
  width: "100%",
  "&:hover .card-flipper": {
    transform: "rotateY(180deg)",
  },
});

const CardFlipper = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  transition: "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  transformStyle: "preserve-3d",
  className: "card-flipper"
});

const CardFace = styled(Box)<{ face: "front" | "back" }>(({ face }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  borderRadius: "30px",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${alpha(DARK, 0.05)}`,
  ...(face === "back" && {
    transform: "rotateY(180deg)",
    background: GRADIENT_PRIMARY,
    color: "#fff",
    padding: "40px",
    justifyContent: "center",
    textAlign: "center"
  }),
}));

const PriceBox = styled(Box)({
  position: "absolute",
  top: 20,
  right: 20,
  padding: "8px 16px",
  background: "rgba(255,255,255,0.95)",
  borderRadius: "14px",
  color: ACCENT,
  fontWeight: 900,
  fontFamily: MONTSERRAT,
  zIndex: 5,
  boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
});

// --- MAIN COMPONENT ---

const Programmes: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const API_URL = `${import.meta.env.VITE_API_HOST}/Couressection`;

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await axios.get(API_URL);
        const rawData = Array.isArray(response.data) ? response.data : response.data?.data || [];
        
        const mapped = rawData.map((item: any, idx: number) => ({
          id: item.id || item._id || `course-${idx}`,
          title: item.courseName || "Executive module",
          desc: item.courseDescription || "Professional grade curriculum for advanced skill acquisition.",
          price: item.coursePrice || "TBA",
          duration: item.courseDuration || "8 Weeks",
          image: item.courseImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000",
          category: (item.courseCategory || "other").toLowerCase()
        }));
        setCourses(mapped);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    getCourses();
  }, [API_URL]);

  const sortedData = useMemo(() => {
    return {
      all: courses,
      tamil: courses.filter(c => c.category.includes("tamil")),
      sinhala: courses.filter(c => c.category.includes("sinhala")),
      english: courses.filter(c => c.category.includes("english")),
      other: courses.filter(c => !["tamil", "sinhala", "english"].some(l => c.category.includes(l)))
    };
  }, [courses]);

  const renderSection = (title: string, list: any[]) => {
    if (list.length === 0) return null;
    return (
      <Box sx={{ mb: 12 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6, px: { xs: 2, md: 0 } }}>
          <Box sx={{ width: 6, height: 35, bgcolor: ACCENT, borderRadius: 4 }} />
          <Typography variant="h3" sx={{ fontFamily: MONTSERRAT, fontWeight: 900, color: DARK, fontSize: { xs: "1.75rem", md: "2.5rem" } }}>
            {title}
          </Typography>
        </Stack>

        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
          effect="coverflow"
          grabCursor
          centeredSlides={false}
          slidesPerView={isMobile ? 1.15 : 3.3}
          coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 1, slideShadows: false }}
          autoplay={{ delay: 5000 }}
          style={{ padding: "10px 10px 70px 10px", overflow: "visible" }}
        >
          {list.map((c) => (
            <SwiperSlide key={c.id}>
              <PerspectiveCard>
                <CardFlipper className="card-flipper">
                  {/* FRONT FACE */}
                  <CardFace face="front" sx={{ bgcolor: "#fff" }}>
                    <Box sx={{ height: 260, position: "relative" }}>
                      <Box component="img" src={c.image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <PriceBox>LKR {c.price}</PriceBox>
                      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
                         {/* <Chip 
                            icon={<HotIcon style={{ color: "#ff9800", fontSize: 16 }} />} 
                            label="BESTSELLER" 
                            sx={{ bgcolor: "#fff", fontWeight: 900, fontFamily: MONTSERRAT, fontSize: "0.65rem" }} 
                         /> */}
                      </Box>
                    </Box>
                    <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h5" sx={{ fontFamily: MONTSERRAT, fontWeight: 800, mb: 2, color: DARK, height: "3.5rem", overflow: "hidden" }}>
                        {c.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 'auto', color: "text.secondary" }}>
                        <TimeIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontFamily: MONTSERRAT, fontWeight: 600 }}>{c.duration}</Typography>
                      </Stack>
                    </Box>
                  </CardFace>

                  {/* BACK FACE */}
                  <CardFace face="back">
                    <MagicIcon sx={{ fontSize: 50, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h5" sx={{ fontFamily: MONTSERRAT, fontWeight: 900, mb: 2 }}>Curriculum Preview</Typography>
                    <Typography variant="body2" sx={{ fontFamily: MONTSERRAT, mb: 4, opacity: 0.8, lineHeight: 1.7 }}>
                      {c.desc.substring(0, 140)}...
                    </Typography>
                    <Divider sx={{ width: "50%", borderColor: "rgba(255,255,255,0.2)", mb: 4, mx: "auto" }} />
                    <Button
                      fullWidth
                      onClick={() => navigate(`/course/${c.id}`)}
                      variant="contained"
                      sx={{
                        bgcolor: "#fff", color: ACCENT, fontWeight: 900, fontFamily: MONTSERRAT, py: 1.5, borderRadius: "14px",
                        "&:hover": { bgcolor: "#f0f0f0" }
                      }}
                    >
                      View Full Syllabus
                    </Button>
                  </CardFace>
                </CardFlipper>
              </PerspectiveCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    );
  };

  if (loading) return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress size={50} thickness={2} sx={{ color: ACCENT }} />
      <Typography sx={{ mt: 3, fontFamily: MONTSERRAT, fontWeight: 900, letterSpacing: 4, color: ACCENT }}>SYNCHRONIZING CATALOGUE</Typography>
    </Box>
  );

  return (
    <MainWrapper>
      {/* BACKGROUND ELEMENTS */}
      <Box sx={{ position: "absolute", top: -150, left: "-10%", width: "40%", height: 600, background: alpha(ACCENT, 0.03), borderRadius: "50%", filter: "blur(100px)", zIndex: 0 }} />

      <Container maxWidth="xl" sx={{ py: 10, position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
            <VerifiedIcon sx={{ color: ACCENT, fontSize: 24 }} />
            <Typography variant="overline" sx={{ fontFamily: MONTSERRAT, fontWeight: 900, letterSpacing: 6, color: ACCENT }}>
              Premium Learning Experience
            </Typography>
          </Stack>
          <Typography variant="h1" sx={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: { xs: "2.5rem", md: "3.5rem" }, mb: 3, color: DARK }}>
            Unlock New <span style={{ color: ACCENT }}>Possibilities.</span>
          </Typography>
          <Typography sx={{ fontFamily: MONTSERRAT, color: "text.secondary", maxWidth: 700, mx: "auto", fontSize: "1.1rem", lineHeight: 1.8 }}>
            Join thousands of professionals mastering new skills through our API-driven interactive courses.
          </Typography>

          {/* NEW PILL-STYLE TABS */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 6, flexWrap: "wrap", gap: 2 }}>
            {["all", "tamil", "sinhala", "english"].map((f) => (
              <TabButton
                key={f}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
                whileTap={{ scale: 0.95 }}
              >
                {f === "all" && <GlobeIcon sx={{ fontSize: 18 }} />}
                {f.toUpperCase()}
                <CountBadge active={activeFilter === f}>
                  {sortedData[f as keyof typeof sortedData].length}
                </CountBadge>
              </TabButton>
            ))}
          </Stack>
        </Box>

        {/* DYNAMIC CONTENT TRANSITIONS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {(activeFilter === "all" || activeFilter === "tamil") && renderSection("Tamil Excellence", sortedData.tamil)}
            {(activeFilter === "all" || activeFilter === "sinhala") && renderSection("Sinhala Core", sortedData.sinhala)}
            {(activeFilter === "all" || activeFilter === "english") && renderSection("English Mastery", sortedData.english)}
            {activeFilter === "all" && sortedData.other.length > 0 && renderSection("Specialized Programs", sortedData.other)}
          </motion.div>
        </AnimatePresence>

        {courses.length === 0 && (
          <Box sx={{ textAlign: "center", py: 15, bgcolor: alpha(ACCENT, 0.02), borderRadius: 10, border: `2px dashed ${alpha(ACCENT, 0.1)}` }}>
            <Typography variant="h4" sx={{ fontFamily: MONTSERRAT, fontWeight: 900, color: alpha(DARK, 0.3) }}>
              No Programs Found in this Category
            </Typography>
          </Box>
        )}
      </Container>
    </MainWrapper>
  );
};

export default Programmes;