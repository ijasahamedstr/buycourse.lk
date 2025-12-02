// src/Page/premium-account-View.tsx
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
  Avatar,
  Stack,
} from "@mui/material";

/* -------------------- Shared Helpers (same style as Couresview) -------------------- */
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

const formatLKR = (val: number | string | null | undefined) => {
  if (val === null || val === undefined || (typeof val === "number" && Number.isNaN(val))) return "LKR —";
  if (typeof val === "number") return `LKR ${val.toLocaleString()}`;
  const str = String(val).trim();
  return str.toUpperCase().startsWith("LKR") ? str : `LKR ${str}`;
};

/* ---------- localStorage helpers (SAME CART as Couresview) ---------- */
const CART_KEY = "cartCourses";

type StoredCourse = {
  id: string;
  courseName: string;
  coursePrice?: any;
  courseImage?: string;
  courseDuration?: string;
  courseCategory?: string;
  addedAt?: number;
};

const readCart = (): StoredCourse[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const writeCart = (items: StoredCourse[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

/* ---------- date util (same idea as Couresview) ---------- */
const formatDate = (ts?: number) => {
  if (!ts) return "N/A";
  const d = new Date(ts);
  return d.toLocaleString(); // en-LK or browser locale
};

/* -------------------- Types -------------------- */
type PlanItem = {
  duration: string;
  price: number | null;
  stockStatus: "InStock" | "OutOfStock";
};

/* -------------------- Normalize plans from Ottservice schema -------------------- */
const normalizePlans = (course: any): PlanItem[] => {
  const plans: PlanItem[] = [];
  const rootStock: "InStock" | "OutOfStock" = course?.stock === "OutOfStock" ? "OutOfStock" : "InStock";

  const pd = course?.planDurations;
  const mh = course?.mainHeadings;

  // duration -> price map from mainHeadings
  const priceMap = new Map<string, number>();
  if (Array.isArray(mh)) {
    mh.forEach((h: any) => {
      const durationRaw = h?.planDurations ?? h?.duration;
      if (!durationRaw) return;
      const duration = String(durationRaw).trim();
      if (!duration) return;

      const prices = h?.Price;
      let firstPrice: any = null;
      if (Array.isArray(prices) && prices.length > 0) firstPrice = prices[0];
      else if (prices != null) firstPrice = prices;
      if (firstPrice == null) return;

      const n = Number(firstPrice);
      if (!Number.isNaN(n)) priceMap.set(duration, n);
    });
  }

  if (Array.isArray(pd) && pd.length > 0) {
    pd.forEach((item: any) => {
      if (!item) return;

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

        const stockStatus: "InStock" | "OutOfStock" = item.stockStatus === "OutOfStock" ? "OutOfStock" : rootStock;
        plans.push({ duration, price, stockStatus });
        return;
      }

      if (typeof item === "string") {
        const duration = item.trim();
        if (!duration) return;
        const price = priceMap.has(duration) ? priceMap.get(duration)! : null;
        plans.push({ duration, price, stockStatus: rootStock });
      }
    });
  } else if (priceMap.size > 0) {
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

  // curriculum state (not rendered yet, kept for future)
  const [, setMainHeadingsArr] = useState<string[]>([]);
  const [, setMainHeadingsMap] = useState<Record<string, string[]>>({});

  // Snackbar now matches Couresview style: text + severity
  const [snack, setSnack] = useState<{ text: string; severity: "success" | "error" | "info" } | null>(null);

  // Cart + drawer state (SAME semantics as Couresview)
  const [added, setAdded] = useState(false); // whether current OTT item is in cart
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<StoredCourse[]>([]);

  // Plan selection ("" = none)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | "">("");

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryId = query.get("id") ?? undefined;
  const querySlug = query.get("slug") ?? undefined;

  const font = "'Montserrat', sans-serif";

  /* ---------- curriculum parser (same logic) ---------- */
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

  /* ---------- fetch Ottservice course ---------- */
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
          } catch {
            // ignore and try slug
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
            setSnack({ text: "Course not found", severity: "error" });
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
        if (!cancelled) setSnack({ text: "Error loading course.", severity: "error" });
      }

      if (!cancelled) setLoading(false);
    };

    fetchCourse();
    return () => {
      cancelled = true;
    };
  }, [slug, id, queryId, querySlug, navigate]);

  /* ---------- init cart from localStorage (shared cart) ---------- */
  useEffect(() => {
    setCartItems(readCart());
  }, []);

  /* ---------- sync `added` state when course changes ---------- */
  useEffect(() => {
    if (!course) return;
    const cart = readCart();
    const baseId = String(course._id ?? course.id ?? course.ottServiceName ?? "");
    const exists = cart.some((c) => {
      // treat any item whose id starts with this baseId as "added"
      return typeof c.id === "string" && c.id.startsWith(baseId);
    });
    setAdded(exists);
  }, [course]);

  /* ---------- listen for cross-tab & other updates on CART_KEY ---------- */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        const latest = readCart();
        setCartItems(latest);

        if (course) {
          const baseId = String(course._id ?? course.id ?? course.ottServiceName ?? "");
          const exists = latest.some((c) => typeof c.id === "string" && c.id.startsWith(baseId));
          setAdded(exists);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [course]);

  /* ---------- map fields (like before) ---------- */
  if (loading)
    return (
      <Box sx={{ textAlign: "center", py: 10, fontFamily: font }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Course…</Typography>
      </Box>
    );

  if (!course)
    return (
      <Box sx={{ textAlign: "center", py: 10, fontFamily: font }}>
        <Typography variant="h6">Course not found</Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );

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
      if (typeof imgs === "object" && (imgs as any)?.url) return (imgs as any).url;
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

  const {
    courseName,
    courseDescription,
    courseImage,
    courseCategory,
    accessLicenseTypes,
    rawPrice,
    coursePrice,
  } = mapped;

  const plans: PlanItem[] = normalizePlans(course);

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

  /* ---------- map OTT course + plan to StoredCourse (shared cart shape) ---------- */
  const getOttBaseId = (c: any) =>
    String(c._id ?? c.id ?? c.ottServiceName ?? c.courseName ?? "");

  const mapOttToStored = (c: any, plan: PlanItem | null): StoredCourse => {
    const baseId = getOttBaseId(c);
    // Make id unique per duration so user can add multiple durations if needed
    const id = plan ? `${baseId}-${plan.duration}` : baseId;

    return {
      id,
      courseName: courseName,
      coursePrice: plan?.price ?? coursePrice,
      courseImage: courseImage,
      courseDuration: plan?.duration ?? "",
      courseCategory: courseCategory,
      addedAt: Date.now(),
    };
  };

  /* ---------- cart operations (same style as Couresview) ---------- */
  const addOttItemToCart = () => {
    if (!selectedPlan) {
      setSnack({ text: "Please select a plan before adding to cart.", severity: "info" });
      return;
    }
    if (selectedPlan.stockStatus === "OutOfStock") {
      setSnack({ text: "Selected plan is out of stock.", severity: "error" });
      return;
    }

    const itemStored = mapOttToStored(course, selectedPlan);
    const cart = readCart();
    const exists = cart.some((it) => it.id === itemStored.id);

    if (!exists) {
      const updated = [...cart, itemStored];
      writeCart(updated);
      setCartItems(updated);
      setAdded(true);
      setSnack({ text: "Added to cart", severity: "success" });
    } else {
      setSnack({ text: "This plan is already in your cart", severity: "info" });
    }
  };

  const removeItemById = (idToRemove: string) => {
    try {
      const cart = readCart();
      const filtered = cart.filter((it) => it.id !== idToRemove);
      writeCart(filtered);
      setCartItems(filtered);

      const baseId = getOttBaseId(course);
      const stillExists = filtered.some((c) => typeof c.id === "string" && c.id.startsWith(baseId));
      setAdded(stillExists);

      setSnack({ text: "Removed from cart", severity: "info" });
    } catch {
      setSnack({ text: "Could not remove item", severity: "error" });
    }
  };

  const handleCardButtonClick = () => {
    if (!added) {
      // Behave like Couresview: first click adds + opens drawer
      addOttItemToCart();
      setDrawerOpen(true);
    } else {
      // Already added: toggle View / Hide
      setDrawerOpen((s) => !s);
    }
  };

  /* ---------- total + WhatsApp (same style as Couresview) ---------- */
  const totalPriceNumber = cartItems.reduce((sum, it) => {
    const raw = it.coursePrice;
    if (raw == null) return sum;
    const digits = String(raw).replace(/[^\d.]/g, "");
    const n = Number(digits);
    return Number.isFinite(n) ? sum + n : sum;
  }, 0);

  const WA_NUMBER = "94767080553";

  const openWhatsApp = () => {
    const orderNumber = `ORD-${Date.now()}`;
    const orderDate = formatDate(Date.now());

    let message = `*New Course Order*%0A%0A`;
    message += `*Order Number:* ${orderNumber}%0A`;
    message += `*Order Date:* ${orderDate}%0A`;
    message += `*Items:* ${cartItems.length}%0A%0A`;

    cartItems.forEach((it, idx) => {
      const name = it.courseName || "N/A";
      const price = formatPrice(it.coursePrice);
      const category = it.courseCategory || "N/A";
      const duration = it.courseDuration || "N/A";
      const addedAt = it.addedAt ? formatDate(it.addedAt) : "N/A";

      message += `*${idx + 1}. ${name}*%0A`;
      message += `Price: ${price}%0A`;
      message += `Category: ${category}%0A`;
      message += `Duration: ${duration}%0A`;
      message += `Added: ${addedAt}%0A%0A`;
    });

    message += `*Total Items:* ${cartItems.length}%0A`;
    message += `*Total Price:* ${totalPriceNumber ? `LKR ${totalPriceNumber}` : "—"}%0A%0A`;
    message += `_Sent via buycourse.lk WhatsApp Checkout_`;

    const url = `https://wa.me/${WA_NUMBER}?text=${message}`;
    window.open(url, "_blank");
  };

  /* -------------------- UI -------------------- */
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        fontFamily: font,
        "& *": { fontFamily: `${font} !important` },
      }}
    >
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnack(null)} severity={snack?.severity ?? "info"}>
          {snack?.text}
        </Alert>
      </Snackbar>

      {/* Breadcrumbs */}
      <Box sx={{ bgcolor: "#f3f6fb", py: 2, mt: 2 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Breadcrumbs separator="›">
            <MUILink component={RouterLink} to="/" underline="hover">
              Home
            </MUILink>
            <MUILink component={RouterLink} to="/programmes" underline="hover">
              Programs
            </MUILink>
            <Typography color="text.primary">{courseName}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 2 }}>
        {/* Row reverse to keep your previous layout */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row-reverse" }, gap: 3 }}>
          {/* LEFT SIDE: content / details */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {courseName}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, flexWrap: "wrap" }}>
                  <Rating value={4.6} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    4.6 (2,315 ratings)
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ mb: 2 }}>{courseDescription}</Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={courseCategory}
                    size="small"
                    sx={{ bgcolor: "#eef4ff", color: "#1E4CA1", fontWeight: 600 }}
                  />
                </Box>

                {/* Details card: plans + access */}
                <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 2 }}>
                  <CardContent>
                    {/* Plans card */}
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        p: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Plans</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{fontFamily: "'Montserrat', sans-serif"}}>
                            Choose a plan duration
                          </Typography>
                        </Box>

                        <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center",fontFamily: "'Montserrat', sans-serif" }}>
                          <Typography sx={{ fontWeight: 800, fontSize: 18,fontFamily: "'Montserrat', sans-serif" }}>
                            {Number.isNaN(minPrice)
                              ? formatLKR(rawPrice)
                              : minPrice === maxPrice
                              ? formatLKR(minPrice)
                              : `${formatLKR(minPrice)} - ${formatLKR(maxPrice)}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                        {plans.length ? (
                          plans.map((p, idx) => {
                            const isSelected = selectedPlanIndex === idx;
                            return (
                              <Chip
                                key={`${p.duration}-${idx}`}
                                label={
                                  p.price != null
                                    ? `${p.duration} • ${formatLKR(p.price)}`
                                    : p.duration
                                }
                                variant={isSelected ? "filled" : "outlined"}
                                color={isSelected ? "primary" : "default"}
                                onClick={() =>
                                  setSelectedPlanIndex(selectedPlanIndex === idx ? "" : idx)
                                }
                                disabled={p.stockStatus === "OutOfStock"}
                              />
                            );
                          })
                        ) : (
                          <Typography variant="body2" color="text.secondary">
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
                        p: 2,
                        mt: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Access</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Choose an access level
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                        {(accessLicenseTypes ?? []).length ? (
                          (accessLicenseTypes ?? []).map((t: string, i: number) => (
                            <Chip key={i} label={t} size="small" />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
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

          {/* RIGHT SIDEBAR: image + plan dropdown + shared cart button */}
          <Box sx={{ width: { xs: "100%", md: 360 } }}>
            <Card sx={{ borderRadius: 2, boxShadow: 5, mb: 2 }}>
              <CardMedia component="img" height="200" image={courseImage} alt={courseName} />
              <CardContent>
                {/* Plan dropdown (mirrors chips selection) */}
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    mt: 1,
                    mb: 2,
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
                  >
                    <MenuItem value="">
                      <em style={{fontFamily: "'Montserrat', sans-serif"}}>Choose a plan</em>
                    </MenuItem>
                    {plans.map((p, idx) => (
                      <MenuItem
                        key={`${p.duration}-${idx}`}
                        value={idx}
                        disabled={p.stockStatus === "OutOfStock"}
                        sx={{fontFamily: "'Montserrat', sans-serif"}}
                      >
                        {p.duration} {p.price != null ? `- ${formatLKR(p.price)}` : ""}{" "}
                        {p.stockStatus === "OutOfStock" ? "(Out of stock)" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Stock status */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Chip
                    label={selectedStock === "InStock" ? "In Stock" : "Out of Stock"}
                    color={selectedStock === "InStock" ? "success" : "error"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Price */}
                <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
                  {sidebarPriceLabel}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* MAIN BUTTON: behaves like Couresview (Add / View / Hide) */}
                <Button
                  fullWidth
                  variant={added ? "outlined" : "contained"}
                  sx={{ py: 1.2 }}
                  onClick={() => {
                    if (!added) {
                      handleCardButtonClick();
                    } else {
                      // when already added, just toggle drawer like Couresview
                      setDrawerOpen((s) => !s);
                    }
                  }}
                  aria-pressed={added}
                  disabled={!added && (selectedStock === "OutOfStock" || !plans.length)}
                >
                  {!added ? "Add to Cart" : drawerOpen ? "Hide" : `View (${cartItems.length})`}
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* ---------- Drawer: EXACT same shared cart layout as Couresview ---------- */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{
            width: { xs: 320, sm: 480 },
            p: 3,
            fontFamily: font,
            "& *": { fontFamily: `${font} !important` },
          }}
          role="presentation"
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Your Cart
            </Typography>
            <Button onClick={() => setDrawerOpen(false)}>Close</Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {cartItems.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="body1" color="text.secondary">
                Your cart is empty.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {cartItems.map((it) => (
                <Box
                  key={it.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    p: 1,
                    borderRadius: 1,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={it.courseImage}
                    alt={it.courseName}
                    sx={{ width: 76, height: 56, bgcolor: "#fff" }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: "13px" }}>
                      {it.courseName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {it.courseDuration ? `${it.courseDuration} • ` : ""}
                      {it.courseCategory ?? ""}
                    </Typography>
                    <Typography sx={{ mt: 0.5 }}>{formatPrice(it.coursePrice)}</Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => removeItemById(it.id)}
                    aria-label={`Remove ${it.courseName}`}
                  >
                    Remove
                  </Button>
                </Box>
              ))}

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="subtitle2">Total</Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    {totalPriceNumber ? `LKR ${totalPriceNumber}` : "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      writeCart([]);
                      setCartItems([]);
                      setAdded(false);
                      setDrawerOpen(false);
                      setSnack({ text: "Cleared cart", severity: "info" });
                    }}
                  >
                    Clear
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => {
                      openWhatsApp();
                    }}
                  >
                    WhatsApp
                  </Button>
                </Box>
              </Box>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
