// src/Page/Couresview.tsx
import { useEffect, useMemo, useState } from "react";
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
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Rating,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

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
  if (price === null || price === undefined || (typeof price === "string" && price.trim() === ""))
    return "LKR —";
  const str = String(price).trim();
  return str.toUpperCase().startsWith("LKR") ? str : `LKR ${str}`;
};

// Lightweight LKR formatter
const formatLKR = (val: number | string | null | undefined) => {
  if (val === null || val === undefined || (typeof val === "number" && Number.isNaN(val)))
    return "LKR —";
  if (typeof val === "number") return `LKR ${val.toLocaleString()}`;
  const str = String(val).trim();
  return str.toUpperCase().startsWith("LKR") ? str : `LKR ${str}`;
};

// Simple date formatter for WhatsApp order meta
const formatDate = (date: number | string | Date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-LK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* -------------------- Types -------------------- */
type PlanItem = {
  duration: string;
  price: number | null;
  stockStatus: "InStock" | "OutOfStock";
};

type CartItem = {
  courseId: string;
  name: string;
  duration: string;
  price: number | null;
  image: string;
  quantity: number;
};

const CART_STORAGE_KEY = "ottCart";
const DEFAULT_THUMB =
  "https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg";

// WhatsApp number (change if needed)
const WA_NUMBER = "94767080553";

/* -------------------- Normalize plans from OTT schema -------------------- */
const normalizePlans = (course: any): PlanItem[] => {
  const plans: PlanItem[] = [];
  const rootStock: "InStock" | "OutOfStock" =
    course?.stock === "OutOfStock" ? "OutOfStock" : "InStock";

  const pd = course?.planDurations;
  const mh = course?.mainHeadings;

  // Build a duration -> price map from mainHeadings (for fallback)
  const priceMap = new Map<string, number>();
  if (Array.isArray(mh)) {
    mh.forEach((h: any) => {
      const durationRaw = h?.planDurations ?? h?.duration;
      if (!durationRaw) return;
      const duration = String(durationRaw).trim();
      if (!duration) return;

      const prices = h?.Price;
      let firstPrice: any = null;
      if (Array.isArray(prices) && prices.length > 0) {
        firstPrice = prices[0];
      } else if (prices != null) {
        firstPrice = prices;
      }
      if (firstPrice == null) return;

      const n = Number(firstPrice);
      if (!Number.isNaN(n)) {
        priceMap.set(duration, n);
      }
    });
  }

  // Prefer planDurations if present
  if (Array.isArray(pd) && pd.length > 0) {
    pd.forEach((item: any) => {
      if (!item) return;

      // New structure: object
      if (typeof item === "object") {
        const durationRaw = item.duration ?? item.planDurations;
        const duration = durationRaw ? String(durationRaw).trim() : "";
        if (!duration) return;

        let price: number | null = null;
        if (item.price != null && !Number.isNaN(Number(item.price))) {
          price = Number(item.price);
        } else if (priceMap.has(duration)) {
          price = priceMap.get(duration)!;
        }

        const stockStatus: "InStock" | "OutOfStock" =
          item.stockStatus === "OutOfStock" ? "OutOfStock" : rootStock;

        plans.push({ duration, price, stockStatus });
        return;
      }

      // Very old structure: string only
      if (typeof item === "string") {
        const duration = item.trim();
        if (!duration) return;
        const price = priceMap.has(duration) ? priceMap.get(duration)! : null;
        plans.push({ duration, price, stockStatus: rootStock });
      }
    });
  } else if (priceMap.size > 0) {
    // No planDurations, but we have mainHeadings — build purely from that
    priceMap.forEach((price, duration) => {
      plans.push({ duration, price, stockStatus: rootStock });
    });
  }

  return plans;
};

/* -------------------- Component -------------------- */
export default function PremiumaccountView() {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any | null>(null);

  // curriculum state setters (values unused, kept for future)
  const [, setMainHeadingsArr] = useState<string[]>([]);
  const [, setMainHeadingsMap] = useState<Record<string, string[]>>({});

  const [snack, setSnack] = useState<string | null>(null);

  // Cart & plan selection
  // "" = nothing selected yet, number = index in plans[]
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | "">("");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
            // depending on your API shape:
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

  /* ---------- load OTT cart from localStorage on mount ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setCartItems(parsed);
      }
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
    }
  }, []);

  const syncCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  };

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
    coursePrice:
      course.discountedPrice ??
      course.discountPrice ??
      course.price ??
      course.coursePrice ??
      "—",

    courseImage: (() => {
      const imgs = course.images ?? course.courseImage ?? course.image ?? null;
      if (!imgs) return "";
      if (Array.isArray(imgs)) return imgs[0] ?? "";
      if (typeof imgs === "string") return imgs;
      if (typeof imgs === "object" && imgs?.url) return imgs.url;
      return "";
    })(),

    courseCategory:
      course.category ??
      course.courseCategory ??
      (Array.isArray(course.accessLicenseTypes) ? course.accessLicenseTypes[0] : undefined) ??
      "General",

    accessLicenseTypes: Array.isArray(course.accessLicenseTypes)
      ? course.accessLicenseTypes
      : course.accessLicenseTypes
      ? String(course.accessLicenseTypes)
          .split(",")
          .map((s: string) => s.trim())
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
    rawPrice,
    coursePrice,
  } = mapped;

  // ---- Normalized plans (from planDurations/mainHeadings) ----
  const plans: PlanItem[] = normalizePlans(course);

  // Compute min/max price for display
  const priceValues = plans
    .map((p) => (p.price != null && !Number.isNaN(p.price) ? p.price : null))
    .filter((v): v is number => v !== null);

  const minPrice = priceValues.length ? Math.min(...priceValues) : NaN;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : NaN;

  const selectedPlan = selectedPlanIndex === "" ? null : plans[selectedPlanIndex as number];

  const selectedStock: "InStock" | "OutOfStock" =
    selectedPlan?.stockStatus ?? (course.stock === "OutOfStock" ? "OutOfStock" : "InStock");

  const sidebarPriceLabel = selectedPlan
    ? formatLKR(selectedPlan.price)
    : Number.isNaN(minPrice)
    ? formatPrice(coursePrice)
    : minPrice === maxPrice
    ? formatLKR(minPrice)
    : `${formatLKR(minPrice)} - ${formatLKR(maxPrice)}`;

  const handleAddToCart = () => {
    if (!selectedPlan) {
      setSnack("Please select a plan before adding to cart.");
      return;
    }
    if (selectedPlan.stockStatus === "OutOfStock") {
      setSnack("Selected plan is out of stock.");
      return;
    }

    const courseId = (course._id ?? course.id ?? "").toString();
    if (!courseId) {
      setSnack("Cannot add this item to cart (no ID).");
      return;
    }

    const newItem: CartItem = {
      courseId,
      name: courseName,
      duration: selectedPlan.duration,
      price: selectedPlan.price,
      image: courseImage,
      quantity: 1,
    };

    const existingIndex = cartItems.findIndex(
      (item) => item.courseId === newItem.courseId && item.duration === newItem.duration
    );

    let newCart: CartItem[];
    if (existingIndex >= 0) {
      newCart = [...cartItems];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + 1,
      };
    } else {
      newCart = [...cartItems, newItem];
    }

    // 1) Update local OTT cart + open local drawer
    syncCart(newCart);
    setCartDrawerOpen(true);

    // 2) ALSO add to global header cart so header drawer sees it
    try {
      const headerAddToCart = (window as any).__BUYCOURSE_ADD_TO_CART;
      if (typeof headerAddToCart === "function") {
        // Make id unique per course+plan so different durations don't clash
        const headerId = `${courseId}-${selectedPlan.duration}`;
        headerAddToCart({
          id: headerId,
          title: courseName,
          coursePrice: selectedPlan.price,
          courseImage,
          courseDuration: selectedPlan.duration,
          courseCategory,
        });
      }
    } catch (e) {
      console.error("Failed to sync OTT cart item to header cart", e);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    syncCart(updated);
  };

  const handleClearCart = () => {
    syncCart([]);
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );

  /* ---------- WhatsApp checkout (rich message) ---------- */
  const handleWhatsApp = () => {
    if (!cartItems.length) return;

    const orderNumber = `ORD-${Date.now()}`;
    const orderDate = formatDate(Date.now());

    let message = `*New OTP Order*\n\n`;
    message += `*Order Number:* ${orderNumber}\n`;
    message += `*Order Date:* ${orderDate}\n`;
    message += `*Items:* ${cartItems.length}\n\n`;

    cartItems.forEach((it, idx) => {
      const qty = it.quantity || 1;
      const unitPrice = it.price ?? 0;
      const lineTotal = unitPrice * qty;

      message += `*${idx + 1}. ${it.name}*\n`;
      message += `Duration: ${it.duration || "N/A"}\n`;
      message += `Qty: ${qty}\n`;
      message += `Price: ${formatLKR(unitPrice)}\n`;
      message += `Line Total: ${formatLKR(lineTotal)}\n\n`;
    });

    message += `*Total Items:* ${cartItems.length}\n`;
    message += `*Total Price:* ${formatLKR(cartTotal)}\n\n`;
    message += `_Sent via buycourse.lk WhatsApp Checkout_`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

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
            <Typography
              color="text.primary"
              sx={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {courseName}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 2 }}>
        {/* NOTE: row-reverse so right content appears on the left on md+ */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row-reverse" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
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
                  {/* Static rating placeholder */}
                  <Rating value={4.6} precision={0.1} readOnly size="small" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: font }}
                  >
                    4.6 (2,315 ratings)
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography
                  sx={{
                    mb: 2,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {courseDescription}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 0.5,
                    }}
                  >
                    <Chip
                      label={courseCategory}
                      size="small"
                      sx={{
                        bgcolor: "#eef4ff",
                        color: "#1E4CA1",
                        fontWeight: 600,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    />
                  </Box>
                </Box>

                {/* ---------- Details Card (Plans + Access) ---------- */}
                <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 2 }}>
                  <CardContent sx={{ fontFamily: font }}>
                    {/* Plans card */}
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        fontFamily: font,
                        p: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          flexWrap: "wrap",
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 18,
                              fontFamily: font,
                            }}
                          >
                            Plans
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFamily: font }}
                          >
                            Choose a plan duration
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            ml: "auto",
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: 18,
                              fontFamily: font,
                            }}
                          >
                            {Number.isNaN(minPrice)
                              ? formatLKR(rawPrice)
                              : minPrice === maxPrice
                              ? formatLKR(minPrice)
                              : `${formatLKR(
                                  minPrice
                                )} - ${formatLKR(maxPrice)}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          mb: 1,
                        }}
                      >
                        {plans.length ? (
                          plans.map((p, idx) => (
                            <Chip
                              key={`${p.duration}-${idx}`}
                              label={
                                p.price != null
                                  ? `${p.duration} • ${formatLKR(p.price)}`
                                  : p.duration
                              }
                              variant="outlined"
                              sx={{ fontFamily: font }}
                            />
                          ))
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            No plan durations available.
                          </Typography>
                        )}
                      </Box>
                    </Card>

                    {/* Access card */}
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        fontFamily: font,
                        p: 2,
                        mt: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          flexWrap: "wrap",
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 18,
                              fontFamily: font,
                            }}
                          >
                            Access
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFamily: font }}
                          >
                            Choose an access level
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            ml: "auto",
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          mb: 1,
                        }}
                      >
                        {(accessLicenseTypes ?? []).length ? (
                          (accessLicenseTypes ?? []).map(
                            (t: string, i: number) => (
                              <Chip
                                key={i}
                                label={t}
                                size="small"
                                sx={{ fontFamily: font }}
                              />
                            )
                          )
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            No access types defined.
                          </Typography>
                        )}
                      </Box>
                    </Card>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Box>

          {/* ---------- RIGHT SIDEBAR CARD (image + plan dropdown + cart) ---------- */}
          <Box sx={{ width: { xs: "100%", md: 360 } }}>
            <Card
              sx={{ borderRadius: 2, boxShadow: 5, mb: 2 }}
              // no onClick, only buttons control drawer
            >
              <CardMedia
                component="img"
                height="200"
                image={courseImage}
                alt={courseName}
              />
              <CardContent>
                {/* Plan dropdown */}
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    mt: 1,
                    mb: 2,
                    "& .MuiInputBase-root": {
                      fontFamily: "'Montserrat', sans-serif",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "'Montserrat', sans-serif",
                    },
                  }}
                >
                  <InputLabel id="plan-select-label">Select Plan</InputLabel>
                  <Select
                    labelId="plan-select-label"
                    label="Select Plan"
                    value={selectedPlanIndex}
                    onChange={(e) => {
                      setSelectedPlanIndex(e.target.value as number | "");
                    }}
                    sx={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <MenuItem value="">
                      <em style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Choose a plan
                      </em>
                    </MenuItem>
                    {plans.map((p, idx) => (
                      <MenuItem
                        key={`${p.duration}-${idx}`}
                        value={idx}
                        disabled={p.stockStatus === "OutOfStock"}
                        sx={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {p.duration}{" "}
                        {p.price != null ? `- ${formatLKR(p.price)}` : ""}{" "}
                        {p.stockStatus === "OutOfStock"
                          ? "(Out of stock)"
                          : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Stock status chip */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Chip
                    label={
                      selectedStock === "InStock"
                        ? "In Stock"
                        : "Out of Stock"
                    }
                    color={selectedStock === "InStock" ? "success" : "error"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Price */}
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 20,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {sidebarPriceLabel}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.2,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  disabled={selectedStock === "OutOfStock" || !plans.length}
                >
                  Add to Cart
                </Button>

                {cartItems.length > 0 && (
                  <Button
                    fullWidth
                    variant="text"
                    sx={{
                      mt: 1,
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCartDrawerOpen(true);
                    }}
                  >
                    View Cart ({cartItems.length})
                  </Button>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* ---------- CART DRAWER (OTT-only, WhatsApp OTP) ---------- */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 360,
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Your Cart
            </Typography>
            <Button
              size="small"
              onClick={() => setCartDrawerOpen(false)}
              sx={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              CLOSE
            </Button>
          </Box>

          {/* Items */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", pb: 2 }}>
            {cartItems.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Your cart is empty.
              </Typography>
            ) : (
              cartItems.map((item, idx) => (
                <Box
                  key={`${item.courseId}-${item.duration}-${idx}`}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2,
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
                    bgcolor: "#fff",
                    gap: 1.5,
                  }}
                >
                  <Box
                    component="img"
                    src={item.image || DEFAULT_THUMB}
                    alt={item.name}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 1,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      {item.duration}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {formatLKR(item.price)}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleRemoveFromCart(idx)}
                      sx={{
                        fontSize: 11,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      REMOVE
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Footer with total + actions */}
          {cartItems.length > 0 && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Total
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {formatLKR(cartTotal)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleClearCart}
                  sx={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  CLEAR
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleWhatsApp}
                  sx={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  WHATSAPP
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "right" }}
              >
                {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
              </Typography>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
