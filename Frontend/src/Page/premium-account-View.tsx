// src/Page/Couresview.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Breadcrumbs,
  Link as MUILink,
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
  Rating,
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
  if (price === null || price === undefined || (typeof price === "string" && price.trim() === "")) {
    return "LKR —";
  }
  const str = String(price).trim();
  return str.toUpperCase().startsWith("LKR") ? str : `LKR ${str}`;
};

// Lightweight LKR formatter & USD->LKR placeholder converter.
// Replace `usdToLkr` with a real conversion if you have one in your app.
const formatLKR = (val: number | string | null | undefined) => {
  if (val === null || val === undefined || (typeof val === "number" && Number.isNaN(val))) return "LKR —";
  if (typeof val === "number") return `LKR ${val.toLocaleString()}`;
  return String(val);
};

const usdToLkr = (usd: number | null | undefined) => {
  if (usd === null || usd === undefined || Number.isNaN(Number(usd))) return NaN;
  // placeholder: 1 USD = 300 LKR (replace with your real rate or service)
  return Math.round(Number(usd) * 300);
};

/* -------------------- Component -------------------- */
export default function Couresview() {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any | null>(null);

  // modules UI state
  const [openModules, setOpenModules] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);
  const toggleModule = (idx: number) => setOpenModuleIndex((prev) => (prev === idx ? null : idx));

  const [mainHeadingsArr, setMainHeadingsArr] = useState<string[]>([]);
  const [mainHeadingsMap, setMainHeadingsMap] = useState<Record<string, string[]>>({});

  const [snack, setSnack] = useState<string | null>(null);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryId = query.get("id") ?? undefined;
  const querySlug = query.get("slug") ?? undefined;

  // Font applied inside component root
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
          parseCurriculum(found.mainHeadings ?? found.main_headings ?? found.curriculum);
          // Open modules by default
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
    courseName: course.ottServiceName ?? course.courseName ?? course.title ?? "Course",
    courseDescription: course.description ?? course.courseDescription ?? "",

    rawPrice: course.price ?? course.coursePrice ?? null,
    rawDiscounted: course.discountedPrice ?? course.discountPrice ?? null,
    coursePrice: course.discountedPrice ?? course.discountPrice ?? course.price ?? course.coursePrice ?? "—",

    courseDuration:
      Array.isArray(course.planDurations) ? course.planDurations.join(" • ") : course.planDurations ?? course.duration ?? course.courseDuration ?? "—",

    courseImage:
      (() => {
        const imgs = course.images ?? course.courseImage ?? course.image ?? null;
        if (!imgs) return "";
        if (Array.isArray(imgs)) return imgs[0] ?? "";
        if (typeof imgs === "string") return imgs;
        if (typeof imgs === "object" && imgs?.url) return imgs.url;
        return "";
      })(),

    courseCategory: course.category ?? course.courseCategory ?? (Array.isArray(course.accessLicenseTypes) ? course.accessLicenseTypes[0] : undefined) ?? "General",

    accessLicenseTypes: Array.isArray(course.accessLicenseTypes)
      ? course.accessLicenseTypes
      : course.accessLicenseTypes
      ? String(course.accessLicenseTypes).split(",").map((s: string) => s.trim())
      : [],

    videoQuality: course.videoQuality ?? "Standard",
  };

  // Destructure mapped values for cleaner JSX
  const {
    courseName,
    courseDescription,
    courseImage,
    courseCategory,
    accessLicenseTypes,
    videoQuality,
    rawPrice,
    rawDiscounted,
    coursePrice,
  } = mapped;

  // Plan durations & price map (placeholders — replace with your real payload fields)
  const planDurations: string[] = Array.isArray(course.planDurations) ? course.planDurations : [];
  const planPriceMapUSD: Record<string, number> = course.planPriceMapUSD ?? course.planPriceMap ?? {};

  // Compute min/max LKR for display if planPriceMapUSD present
  const planPricesLKR = Object.values(planPriceMapUSD)
    .map((v) => usdToLkr(Number(v)))
    .filter((n) => !Number.isNaN(n));
  const minLKR = planPricesLKR.length ? Math.min(...planPricesLKR) : NaN;
  const maxLKR = planPricesLKR.length ? Math.max(...planPricesLKR) : NaN;

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        fontFamily: font,
        "& *": { fontFamily: font },
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
            <MUILink component={RouterLink} to="/" underline="hover">
              Home
            </MUILink>
            <MUILink component={RouterLink} to="/programmes" underline="hover">
              Programs
            </MUILink>
            <Typography color="text.primary" sx={{ fontFamily: "'Montserrat', sans-serif" }}>{courseName}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 2 }}>
        {/* NOTE: changed row -> row-reverse so right content appears on the left on md+ */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row-reverse" }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: "'Montserrat', sans-serif" }}>
                  {courseName}
                </Typography>
                   <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, flexWrap: "wrap", fontFamily: font }}>
                      {/* If your API provides a rating replace this with mapped value */}
                      <Rating value={4.6} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                        4.6 (2,315 ratings)
                      </Typography>
                    </Box>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ mb: 2, fontFamily: "'Montserrat', sans-serif" }}>{courseDescription}</Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                    <Chip
                      label={courseCategory}
                      size="small"
                      sx={{ bgcolor: "#eef4ff", color: "#1E4CA1", fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </Box>
                </Box>

                {/* ---------- Details Card (cleaned) ---------- */}
                <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 2 }}>
                  <CardContent sx={{ fontFamily: font }}>
                    {/* Plans card (visual) */}
                    <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden", fontFamily: font, p: 2 }}>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 18, fontFamily: font }}>Plans</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>Choose a plan duration</Typography>
                        </Box>

                        <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
                          <Typography sx={{ fontWeight: 800, fontSize: 18, fontFamily: font }}>
                            {Number.isNaN(minLKR) ? formatLKR(rawPrice) : `${formatLKR(minLKR)} - ${formatLKR(maxLKR)}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                        {planDurations.length ? (
                          planDurations.map((p, idx) => (
                            <Chip key={idx} label={`${p} • ${formatLKR(usdToLkr(planPriceMapUSD[p] ?? NaN))}`} variant="outlined" sx={{ fontFamily: font }} />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">No plan durations available.</Typography>
                        )}
                      </Box>
                    </Card>

                    {/* Access card */}
                    <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden", fontFamily: font, p: 2, mt: 2 }}>
          
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 18, fontFamily: font }}>Access</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>Choose an access level</Typography>
                        </Box>

                        <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                        {(accessLicenseTypes ?? []).map((t: string, i: number) => (
                          <Chip key={i} label={t} size="small" sx={{ fontFamily: font }} />
                        ))}
                      </Box>
                    </Card>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: { xs: "100%", md: 360 } }}>
            <Card sx={{ borderRadius: 2, boxShadow: 5, mb: 2 }}>
              <CardMedia component="img" height="200" image={courseImage} alt={courseName} />
              <CardContent>
                <Typography sx={{ fontWeight: 700, fontSize: 20, fontFamily: "'Montserrat', sans-serif" }}>{formatPrice(coursePrice)}</Typography>

                <Divider sx={{ my: 2 }} />

                <Button fullWidth variant="contained" sx={{ py: 1.2, fontFamily: "'Montserrat', sans-serif" }}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
