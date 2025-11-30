// src/Page/Couresview.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/* -------------------- Helpers -------------------- */
const normalizeText = (s = "") =>
  s
    .toString()
    .normalize("NFKD")
    .replace(/[̀-\u036f]/g, "")
    .toLowerCase()
    .trim();

const slugify = (text?: string) =>
  normalizeText(String(text ?? ""))
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");

const formatPrice = (price: any) => {
  // Show 'LKR —' when price empty or null
  if (price === null || price === undefined || (typeof price === "string" && price.trim() === "")) {
    return "LKR —";
  }
  const str = String(price).trim();
  return str.toUpperCase().startsWith("LKR") ? str : `LKR ${str}`;
};

/* -------------------- Component -------------------- */
export default function Couresview() {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any | null>(null);

  // modules UI state (re-used for curriculum accordion as well)
  const [openModules, setOpenModules] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);
  const toggleModule = (idx: number) => setOpenModuleIndex((prev) => (prev === idx ? null : idx));

  const [mainHeadingsArr, setMainHeadingsArr] = useState<string[]>([]);
  const [mainHeadingsMap, setMainHeadingsMap] = useState<Record<string, string[]>>({});

  const [snack, setSnack] = useState<string | null>(null);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryId = query.get("id") ?? undefined;
  const querySlug = query.get("slug") ?? undefined;

  // Font applied globally inside the component root
  const font = "'Montserrat', sans-serif";

  /* ---------- curriculum parser ---------- */
  const parseCurriculum = (incoming: any) => {
    const arr: string[] = [];
    const map: Record<string, string[]> = {};

    if (!incoming) {
      setMainHeadingsArr([]);
      setMainHeadingsMap({});
      return;
    }

    const mainList = Array.isArray(incoming) ? incoming : [incoming];

    mainList.forEach((m) => {
      if (typeof m === "string") {
        arr.push(m);
        map[m] = [];
        return;
      }

      const heading = (m && (m.heading ?? m.title)) || "Untitled";
      arr.push(heading);

      const subs = Array.isArray(m.subHeadings)
        ? m.subHeadings
        : typeof m.subHeadings === "string"
        ? m.subHeadings.split(",").map((s: string) => s.trim())
        : [];

      map[heading] = subs.map(String);
    });

    setMainHeadingsArr(arr);
    setMainHeadingsMap(map);
  };

  /* ---------- fetch course ---------- */
  useEffect(() => {
    let cancelled = false;

    const fetchCourse = async () => {
      setLoading(true);

      try {
        const apiBase = (import.meta.env.VITE_API_HOST ?? "").replace(/\/$/, "");
        const wantedId = id ?? queryId;

        let found: any = null;

        if (wantedId) {
          try {
            const res = await axios.get(`${apiBase}/Ottservice/${wantedId}`);
            found = res.data?.data ?? res.data ?? null;
          } catch (e) {
            // ignore and continue to slug search
          }
        }

        if (!found && (slug ?? querySlug)) {
          const res = await axios.get(`${apiBase}/Ottservice`);
          const data = res.data;

          let items: any[] = [];
          if (Array.isArray(data)) items = data;
          else if (Array.isArray(data?.data)) items = data.data;
          else if (Array.isArray(data?.rows)) items = data.rows;
          else {
            const firstArray = Object.values(data ?? {}).find((v) => Array.isArray(v));
            items = Array.isArray(firstArray) ? firstArray : [];
          }

          const target = slugify(slug ?? querySlug ?? "");

          found = items.find((c: any) => {
            const idVal = c.id ?? c._id ?? "";
            // new ott service field ottServiceName should be considered
            const titleVal = c.ottServiceName ?? c.courseName ?? c.title ?? "";
            return [slugify(idVal), slugify(titleVal)].includes(target);
          });
        }

        if (!found) {
          if (!cancelled) {
            setSnack("Course not found");
            navigate(-1);
          }
          return;
        }

        if (!cancelled) {
          setCourse(found);
          // curriculum fields might be mainHeadings or main_headings or curriculum
          parseCurriculum(found.mainHeadings ?? found.main_headings ?? found.curriculum);
          // Open modules by default as before
          setOpenModules(true);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setSnack("Error loading course.");
      }

      if (!cancelled) setLoading(false);
    };

    fetchCourse();
    return () => {
      cancelled = true;
    };
  }, [slug, id, queryId, querySlug, navigate]);

  /* ---------- UI states ---------- */
  if (loading)
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Course…</Typography>
      </Box>
    );

  if (!course)
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h6">Course not found</Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );

  /* ---------- map fields (supporting both legacy + new Ottservice fields) ---------- */
  const mapped = {
    // title - prefer ottServiceName, fall back to older fields
    courseName: course.ottServiceName ?? course.courseName ?? course.title ?? "Course",

    // description
    courseDescription: course.description ?? course.courseDescription ?? course.description ?? "",

    // price: prefer discountedPrice if present, else price, else legacy fields
    rawPrice: course.price ?? course.coursePrice ?? null,
    rawDiscounted: course.discountedPrice ?? course.discountedPrice ?? course.discountPrice ?? null,
    coursePrice: course.discountedPrice ?? course.discountPrice ?? course.price ?? course.coursePrice ?? "—",

    // duration - planDurations could be array or string; normalize to string for display
    courseDuration:
      Array.isArray(course.planDurations) ? course.planDurations.join(" • ") : course.planDurations ?? course.duration ?? course.courseDuration ?? "—",

    // images - supports array or single string
    courseImage:
      (() => {
        const imgs = course.images ?? course.courseImage ?? course.image ?? null;
        if (!imgs) return "";
        if (Array.isArray(imgs)) return imgs[0] ?? "";
        if (typeof imgs === "string") return imgs;
        // maybe object with url
        if (typeof imgs === "object" && imgs.url) return imgs.url;
        return "";
      })(),

    // category - fallback
    courseCategory: course.category ?? course.courseCategory ?? (Array.isArray(course.accessLicenseTypes) ? course.accessLicenseTypes[0] : undefined) ?? "General",

    // access license types (array or string)
    accessLicenseTypes: Array.isArray(course.accessLicenseTypes)
      ? course.accessLicenseTypes
      : course.accessLicenseTypes
      ? String(course.accessLicenseTypes).split(",").map((s: string) => s.trim())
      : [],

    // video quality
    videoQuality: course.videoQuality ?? "Standard",
  };

  const modulesSubdomain = mapped.courseCategory;

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        fontFamily: font,
        "& *": { fontFamily: font }, // apply Montserrat globally inside this component
      }}
    >
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSnack(null)}>
          {snack}
        </Alert>
      </Snackbar>

      <Box sx={{ bgcolor: "#f3f6fb", py: 2, mt: 2 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Breadcrumbs separator="›">
            <Link href="/" underline="hover">
              Home
            </Link>
            <Link href="/programmes" underline="hover">
              Programs
            </Link>
            <Typography color="text.primary" sx={{ fontFamily: "'Montserrat', sans-serif" }}>{mapped.courseName}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800 , fontFamily: "'Montserrat', sans-serif",}}>
                  {mapped.courseName}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ mb: 2 , fontFamily: "'Montserrat', sans-serif",}}>{mapped.courseDescription}</Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 , fontFamily: "'Montserrat', sans-serif",}}>
                      Modules
                    </Typography>

                    <Chip
                      label={modulesSubdomain}
                      size="small"
                      sx={{ bgcolor: "#eef4ff", color: "#1E4CA1", fontWeight: 600 , fontFamily: "'Montserrat', sans-serif",}}
                    />
                  </Box>
                </Box>

                {/* ---------- Replaced Card: use curriculum (mainHeadingsArr/mainHeadingsMap) ---------- */}
                <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f7faff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 16, fontFamily: "'Montserrat', sans-serif", }}>Curriculum Preview</Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: "'Montserrat', sans-serif", }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Montserrat', sans-serif",}}>
                        {mainHeadingsArr.length} items
                      </Typography>

                      <IconButton
                        aria-expanded={openModules}
                        aria-label={openModules ? "Collapse curriculum" : "Expand curriculum"}
                        size="small"
                        onClick={() => setOpenModules((s) => !s)}
                        sx={{
                          transform: openModules ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 200ms ease",
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Collapse in={openModules} timeout="auto" unmountOnExit sx={{ fontFamily: "'Montserrat', sans-serif",}}>
                    <Box sx={{ fontFamily: "'Montserrat', sans-serif",}}>
                      {mainHeadingsArr.length > 0 ? (
                        mainHeadingsArr.map((heading, i) => {
                          const isOpen = openModuleIndex === i;
                          const subs = mainHeadingsMap[heading] ?? [];
                          return (
                            <Box key={i}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  py: 1.25,
                                  px: 2,
                                  borderBottom: i < mainHeadingsArr.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
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
                                  <Typography sx={{ fontWeight: 600,fontFamily: "'Montserrat', sans-serif" }}>{heading}</Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Montserrat', sans-serif",}}>
                                    {subs.length > 0 ? `${subs.length} topics` : "No topics"}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: "flex", gap: 1, alignItems: "center", fontFamily: "'Montserrat', sans-serif", }}>
                                  <Chip
                                    label={`Section ${i + 1}`}
                                    size="small"
                                    sx={{ bgcolor: "#e8f0ff", color: "#1E4CA1", fontWeight: 600, fontSize: 12, fontFamily: "'Montserrat', sans-serif", }}
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

                              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 2, bgcolor: "#fbfdff" }}>
                                  <Typography sx={{ fontWeight: 600, mb: 1, fontFamily: "'Montserrat', sans-serif", }}>{heading} — Topics</Typography>

                                  {subs.length ? (
                                    <List dense>
                                      {subs.map((sub, sidx) => (
                                        <ListItem key={sidx} sx={{ pl: 0 }}>
                                          <ListItemText
                                            primary={sub}
                                            primaryTypographyProps={{
                                              sx: { fontFamily: "'Montserrat', sans-serif" }
                                            }}
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  ) : (
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
                                          fontFamily: "'Montserrat', sans-serif",
                                        }}
                                      >
                                        <Box>
                                          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>No topics listed</Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                              </Collapse>
                            </Box>
                          );
                        })
                      ) : (
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Montserrat', sans-serif",}}>
                            Curriculum not available.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Card>
                {/* ---------- End replaced card ---------- */}
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: { xs: "100%", md: 360 } }}>
            <Card sx={{ borderRadius: 2, boxShadow: 5, mb: 2 }}>
              <CardMedia component="img" height="200" image={mapped.courseImage} alt={mapped.courseName} />
              <CardContent>
                <Typography sx={{ fontWeight: 700, fontSize: 20 ,fontFamily: "'Montserrat', sans-serif"}}>
                  {formatPrice(mapped.coursePrice)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Button fullWidth variant="contained" sx={{ py: 1.2,fontFamily: "'Montserrat', sans-serif" }}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1,fontFamily: "'Montserrat', sans-serif" }}>Course Details</Typography>
              <Typography variant="body2" sx={{fontFamily: "'Montserrat', sans-serif"}}>Duration: {mapped.courseDuration}</Typography>
              <Typography variant="body2" sx={{fontFamily: "'Montserrat', sans-serif"}}>Category: {mapped.courseCategory}</Typography>
              <Typography variant="body2" sx={{fontFamily: "'Montserrat', sans-serif"}}>Video Quality: {mapped.videoQuality}</Typography>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
