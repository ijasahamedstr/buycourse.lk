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
  Drawer,
  Avatar,
  Stack,
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

/* ---------- localStorage helpers ---------- */
const CART_KEY = "cartCourses";
const OTT_CART_KEY = "ottCart"; // OTT cart key used in PremiumaccountView etc.

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
    // ignore localStorage errors
  }
};

/** Clear cart-related localStorage for ALL pages (courses + OTT) */
const clearAllCartStorage = () => {
  try {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(OTT_CART_KEY);

    // optional event other components can listen for (header, OTT page, etc.)
    try {
      window.dispatchEvent(new Event("cartCleared"));
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
};

/* ---------- small util ---------- */
const formatDate = (ts?: number) => {
  if (!ts) return "N/A";
  const d = new Date(ts);
  return d.toLocaleString(); // uses user's locale; change if you need fixed format
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

  // snack now contains text + severity
  const [snack, setSnack] = useState<{ text: string; severity: "success" | "error" | "info" } | null>(null);

  // NEW: cart / drawer state
  const [added, setAdded] = useState(false); // whether current course added to cart
  const [drawerOpen, setDrawerOpen] = useState(false); // whether drawer is visible
  const [cartItems, setCartItems] = useState<StoredCourse[]>([]); // all items from localStorage

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
            const res = await axios.get(`${apiBase}/Couressection/${wantedId}`);
            found = res.data?.data ?? res.data ?? null;
          } catch (e) {
            // ignore and continue to slug search
          }
        }

        if (!found && (slug ?? querySlug)) {
          const res = await axios.get(`${apiBase}/Couressection`);
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
            const titleVal = c.courseName ?? c.title ?? "";
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
          parseCurriculum(found.mainHeadings ?? found.main_headings);
          // NEW LINE: Set the main modules collapse to open on load
          setOpenModules(true);
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

  /* ---------- initialize cartItems from localStorage ---------- */
  useEffect(() => {
    setCartItems(readCart());
  }, []);

  /* ---------- sync added state when course loads ---------- */
  useEffect(() => {
    if (!course) return;
    const cart = readCart();
    const courseId = String(course.id ?? course._id ?? course.courseId ?? course.courseName ?? "");
    const exists = cart.some((c) => c.id === courseId);
    setAdded(exists);
    // do not automatically open drawer on load even if exists
  }, [course]);

  /* ---------- listen for cross-tab storage changes ---------- */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        setCartItems(readCart());
        // also update `added` for this course if loaded
        if (course) {
          const courseId = String(course.id ?? course._id ?? course.courseId ?? course.courseName ?? "");
          setAdded(readCart().some((c) => c.id === courseId));
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [course]);

  /* ---------- cart operations ---------- */
  const getCourseId = (c: any) => String(c.id ?? c._id ?? c.courseId ?? c.courseName ?? "");

  const mapCourseToStored = (c: any): StoredCourse => ({
    id: getCourseId(c),
    courseName: c.courseName ?? c.title ?? "",
    coursePrice: c.coursePrice ?? c.price ?? "",
    courseImage: c.courseImage ?? c.image ?? "",
    courseDuration: c.duration ?? c.courseDuration ?? "",
    courseCategory: c.courseCategory ?? c.category ?? "",
    addedAt: Date.now(),
  });

  const addCourseToCart = (c: any) => {
    try {
      const cart = readCart();
      const item = mapCourseToStored(c);
      const exists = cart.some((it) => it.id === item.id);
      if (!exists) {
        cart.push(item);
        writeCart(cart);
        setAdded(true);
        setCartItems(cart);
        setSnack({ text: "Added to cart", severity: "success" });
      } else {
        setSnack({ text: "Course already in cart", severity: "info" });
      }
    } catch (err) {
      setSnack({ text: "Could not add to cart", severity: "error" });
    }
  };

  const removeItemById = (idToRemove: string) => {
    try {
      const cart = readCart();
      const filtered = cart.filter((it) => it.id !== idToRemove);
      writeCart(filtered);
      setCartItems(filtered);
      // if the removed item is the current course, update `added`
      if (course && getCourseId(course) === idToRemove) setAdded(false);
      setSnack({ text: "Removed from cart", severity: "info" });
    } catch {
      setSnack({ text: "Could not remove item", severity: "error" });
    }
  };

  // NEW: handle add/view button click
  const handleCardButtonClick = () => {
    if (!added) {
      // first click: "Add to Cart" behavior
      addCourseToCart(course);
      setDrawerOpen(true); // open drawer to show cart / details
    } else {
      // already added: toggle drawer (View / Hide)
      setDrawerOpen((s) => !s);
    }
  };

  /* ---------- calculate simple totals (best-effort numeric parse) ---------- */
  const totalPriceNumber = cartItems.reduce((sum, it) => {
    const raw = it.coursePrice ?? it.coursePrice;
    if (raw == null) return sum;
    // try to parse numbers from strings like 'LKR 2000' or '2000'
    const digits = String(raw).replace(/[^\d.]/g, "");
    const n = Number(digits);
    return Number.isFinite(n) ? sum + n : sum;
  }, 0);

  /* ---------- WhatsApp checkout ---------- */
  const WA_NUMBER = "94767080553";

  const openWhatsApp = () => {
    // build order meta
    const orderNumber = `ORD-${Date.now()}`; // simple order id — replace with server id if you have one
    const orderDate = formatDate(Date.now());

    // build message header
    let message = `*New Course Order*%0A%0A`;

    // order meta
    message += `*Order Number:* ${orderNumber}%0A`;
    message += `*Order Date:* ${orderDate}%0A`;
    message += `*Items:* ${cartItems.length}%0A%0A`;

    // list each course
    cartItems.forEach((it, idx) => {
      const name = it.courseName || "N/A";
      const price = formatPrice(it.coursePrice);
      const category = it.courseCategory || "N/A";
      const duration = it.courseDuration || "N/A";
      const added = it.addedAt ? formatDate(it.addedAt) : "N/A";

      message += `*${idx + 1}. ${name}*%0A`;
      message += `Price: ${price}%0A`;
      message += `Category: ${category}%0A`;
      message += `Duration: ${duration}%0A`;
      message += `Added: ${added}%0A%0A`;
    });

    // totals & footer
    message += `*Total Items:* ${cartItems.length}%0A`;
    message += `*Total Price:* ${totalPriceNumber ? `LKR ${totalPriceNumber}` : "—"}%0A%0A`;
    message += `_Sent via buycourse.lk WhatsApp Checkout_`;

    const url = `https://wa.me/${WA_NUMBER}?text=${message}`;
    window.open(url, "_blank");
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

  /* ---------- map fields ---------- */
  const mapped = {
    courseName: course.courseName ?? course.title ?? "Course",
    courseDescription: course.courseDescription ?? course.description ?? "",
    coursePrice: course.coursePrice ?? course.price ?? "—",
    courseDuration: course.duration ?? course.courseDuration ?? "—",
    courseImage: course.courseImage ?? course.image ?? "",
    courseCategory: course.courseCategory ?? course.category ?? "General",
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
        <Alert onClose={() => setSnack(null)} severity={snack?.severity ?? "info"}>
          {snack?.text}
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
            <Typography color="text.primary" sx={{ fontFamily: "'Montserrat', sans-serif" }}>
              {mapped.courseName}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: "'Montserrat', sans-serif" }}>
                  {mapped.courseName}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ mb: 2, fontFamily: "'Montserrat', sans-serif" }}>
                  {mapped.courseDescription}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                      Modules
                    </Typography>

                    <Chip
                      label={modulesSubdomain}
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

                {/* ---------- Curriculum card ---------- */}
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
                    <Typography sx={{ fontWeight: 600, fontSize: 16, fontFamily: "'Montserrat', sans-serif" }}>
                      Curriculum Preview
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: "'Montserrat', sans-serif" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Montserrat', sans-serif" }}>
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

                  <Collapse in={openModules} timeout="auto" unmountOnExit sx={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <Box sx={{ fontFamily: "'Montserrat', sans-serif" }}>
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
                                  borderBottom:
                                    i < mainHeadingsArr.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
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
                                  <Typography sx={{ fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}>
                                    {heading}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontFamily: "'Montserrat', sans-serif" }}
                                  >
                                    {subs.length > 0 ? `${subs.length} topics` : "No topics"}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                    fontFamily: "'Montserrat', sans-serif",
                                  }}
                                >
                                  <Chip
                                    label={`Section ${i + 1}`}
                                    size="small"
                                    sx={{
                                      bgcolor: "#e8f0ff",
                                      color: "#1E4CA1",
                                      fontWeight: 600,
                                      fontSize: 12,
                                      fontFamily: "'Montserrat', sans-serif",
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

                              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 2, bgcolor: "#fbfdff" }}>
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      mb: 1,
                                      fontFamily: "'Montserrat', sans-serif",
                                    }}
                                  >
                                    {heading} — Topics
                                  </Typography>

                                  {subs.length ? (
                                    <List dense>
                                      {subs.map((sub, sidx) => (
                                        <ListItem key={sidx} sx={{ pl: 0 }}>
                                          <ListItemText
                                            primary={sub}
                                            primaryTypographyProps={{
                                              sx: { fontFamily: "'Montserrat', sans-serif" },
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
                                          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                                            No topics listed
                                          </Typography>
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
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
                <Typography sx={{ fontWeight: 700, fontSize: 20, fontFamily: "'Montserrat', sans-serif" }}>
                  {formatPrice(mapped.coursePrice)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* UPDATED BUTTON: toggles add/view/hide + opens drawer */}
                <Button
                  fullWidth
                  variant={added ? "outlined" : "contained"}
                  sx={{ py: 1.2, fontFamily: "'Montserrat', sans-serif" }}
                  onClick={handleCardButtonClick}
                  aria-pressed={added}
                >
                  {!added ? "Add to Cart" : drawerOpen ? "Hide" : `View (${cartItems.length})`}
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1, fontFamily: "'Montserrat', sans-serif" }}>
                Course Details
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Montserrat', sans-serif" }}>
                Duration: {mapped.courseDuration}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Montserrat', sans-serif" }}>
                Category: {mapped.courseCategory}
              </Typography>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* ---------- Drawer: shows full cart list from localStorage ---------- */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: 320, sm: 480 }, p: 3, fontFamily: "'Montserrat', sans-serif" }} role="presentation">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
              Your Cart
            </Typography>
            <Button onClick={() => setDrawerOpen(false)} sx={{ fontFamily: "'Montserrat', sans-serif" }}>
              Close
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {cartItems.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontFamily: "'Montserrat', sans-serif" }}
              >
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
                    sx={{ width: 76, height: 56, bgcolor: "#fff", fontFamily: "'Montserrat', sans-serif" }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "13px",
                      }}
                    >
                      {it.courseName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {it.courseDuration ? `${it.courseDuration} • ` : ""}
                      {it.courseCategory ?? ""}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontFamily: "'Montserrat', sans-serif" }}>
                      {formatPrice(it.coursePrice)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => removeItemById(it.id)}
                      aria-label={`Remove ${it.courseName}`}
                      sx={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))}

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Total
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                    {totalPriceNumber ? `LKR ${totalPriceNumber}` : "—"}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      // ✅ CLEAR CART FOR ALL PAGES (localStorage)
                      clearAllCartStorage();
                      setCartItems([]);
                      setAdded(false);
                      setDrawerOpen(false);
                      setSnack({ text: "Cleared cart", severity: "info" });
                    }}
                    sx={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Clear
                  </Button>

                  {/* WhatsApp button */}
                  <Button
                    variant="contained"
                    onClick={() => {
                      openWhatsApp();
                    }}
                    sx={{ fontFamily: "'Montserrat', sans-serif" }}
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
