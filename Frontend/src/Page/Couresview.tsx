import React, { useState, useEffect } from "react";
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
  Drawer,
  ListItemAvatar,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
};

type ModuleItem = {
  title: string;
  duration: string;
  finished?: boolean;
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

  // modules moved to state so they can be edited and marked finished
  const [modules, setModules] = useState<ModuleItem[]>([
    { title: "Academic English", duration: "22 mins", finished: false },
    { title: "Essentials Of Computing", duration: "44 mins", finished: false },
    { title: "Mathematics I", duration: "26 mins", finished: false },
    { title: "Professional Communication", duration: "29 mins", finished: false },
    { title: "Understanding Organizations", duration: "56 mins", finished: false },
    { title: "Introduction To Economics", duration: "55 mins", finished: false },
    { title: "Principles Of Marketing", duration: "42 mins", finished: false },
    { title: "Introduction To Accounting", duration: "34 mins", finished: false },
  ]);

  const modulesSubdomain = courseCategory;

  const toggleModule = (idx: number) => {
    setOpenModuleIndex((prev) => (prev === idx ? null : idx));
  };

  // Dialog (View Card) state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const [viewTitle, setViewTitle] = useState("");
  const [viewFinished, setViewFinished] = useState(false);

  const openViewDialog = (idx: number) => {
    setViewIndex(idx);
    setViewTitle(modules[idx].title);
    setViewFinished(!!modules[idx].finished);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setViewIndex(null);
  };

  const saveViewChanges = () => {
    if (viewIndex === null) return;
    setModules((prev) => {
      const next = [...prev];
      next[viewIndex] = { ...next[viewIndex], title: viewTitle, finished: viewFinished };
      return next;
    });
    setViewDialogOpen(false);
    setViewIndex(null);
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

  // -----------------------
  // Cart Drawer state + helpers
  // -----------------------
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    const onOpenCart = () => setCartOpen(true);
    window.addEventListener("openCart", onOpenCart);
    return () => window.removeEventListener("openCart", onOpenCart);
  }, []);

  const parsePrice = (p: string | number) => {
    if (typeof p === "number") return p;
    if (typeof p === "string") {
      const cleaned = p.replace(/[^0-9.]/g, "");
      const n = parseFloat(cleaned);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  /**
   * addToCart (no-popup behavior)
   * - If item already exists in cart: DO NOT increment qty.
   *   Instead, just open the cart drawer (no dialog/popover).
   * - If not present: add with qty (default 1) as before.
   */
  const addToCart = (item: Omit<CartItem, "qty"> & { qty?: number }) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id);
      if (idx >= 0) {
        // item already in cart -> do not increment; simply open cart
        setCartOpen(true);
        return prev;
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
    // For analytics / external listeners
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { source: "CoursePage" } }));
  };

  const updateQty = (id: string, qty: number) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const cartTotal = cart.reduce((s, it) => s + it.price * it.qty, 0);

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return;
    const items = cart.map((it) => `${it.title} x${it.qty} — ${formatMoney(it.price * it.qty)}`).join("\n");
    const message = `
New Order - buycourse.lk

${items}

Total: ${formatMoney(cartTotal)}

Customer info: (please add name & contact)
`;
    const phoneNumber = "94767080553";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const formatMoney = (n: number) => `$${n.toFixed(2)}`;

  // ---------- UI - render ----------
  return (
    <Box sx={{ bgcolor: "#fff", fontFamily: font, pt: 0 }}>
      {/* DEMO VIDEO (renders only when link provided) */}
      {coursedemovideolink ? (
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, mt: 0 }}>
          <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 700, mb: 1, fontFamily: font }}>Course demo</Typography>

              {isYouTube(coursedemovideolink) ? (
                <Box sx={{ position: "relative", pt: "56.25%" }}>
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
                                borderBottom: i < modules.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                                cursor: "pointer",
                              }}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleModule(i)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") toggleModule(i);
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box>
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      fontFamily: font,
                                      textDecoration: m.finished ? "line-through" : "none",
                                    }}
                                  >
                                    {m.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                                    Module overview • {m.duration}
                                  </Typography>
                                </Box>

                                {m.finished && (
                                  <Chip
                                    label="Finished"
                                    size="small"
                                    sx={{ ml: 1, bgcolor: "#eef6ee", color: "#1a7f35", fontWeight: 600, fontFamily: font }}
                                  />
                                )}
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

                                {/* VIEW / EDIT button - opens dialog */}
                                <IconButton
                                  size="small"
                                  aria-label="view-module"
                                  onClick={(e) => {
                                    // prevent parent row click (toggle) from firing
                                    e.stopPropagation();
                                    openViewDialog(i);
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
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
                  onClick={() =>
                    addToCart({
                      id: "course_" + (courseName || "course").replace(/\s+/g, "_").toLowerCase(),
                      title: courseName,
                      price: parsePrice(coursePrice),
                      image: courseImage,
                    })
                  }
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

      {/* ---------- Cart Drawer ---------- */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: { xs: 320, sm: 420 }, p: 2, fontFamily: font }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: 700,fontFamily: "'Montserrat', sans-serif"}}>Your Cart</Typography>
            <Typography variant="body2" color="text.secondary" sx={{fontFamily: "'Montserrat', sans-serif"}}>
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </Typography>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {cart.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{fontFamily: "'Montserrat', sans-serif"}}>Your cart is empty.</Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 420, overflow: "auto" }}>
              {cart.map((it) => (
                <ListItem key={it.id} sx={{ alignItems: "flex-start" }}>
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={it.image} alt={it.title} />
                  </ListItemAvatar>
                  <Box sx={{ flex: 1, ml: 1 }}>
                    <Typography sx={{ fontWeight: 700,fontFamily: "'Montserrat', sans-serif" }}>{it.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{fontFamily: "'Montserrat', sans-serif"}}>
                      {formatMoney(it.price)} each
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1,fontFamily: "'Montserrat', sans-serif" }}>
                      <IconButton size="small" onClick={() => updateQty(it.id, it.qty - 1)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <TextField
                        value={it.qty}
                        onChange={(e) => {
                          const v = parseInt(e.target.value || "1", 10) || 1;
                          updateQty(it.id, v);
                        }}
                        inputProps={{ inputMode: "numeric", min: 1, style: { textAlign: "center" } }}
                        size="small"
                        sx={{ width: 64 }}
                      />
                      <IconButton size="small" onClick={() => updateQty(it.id, it.qty + 1)} sx={{fontFamily: "'Montserrat', sans-serif"}}>
                        <AddIcon fontSize="small" />
                      </IconButton>

                      <Box sx={{ flex: 1 }} />
                      <Typography sx={{ fontWeight: 700,fontFamily: "'Montserrat', sans-serif" }}>{formatMoney(it.price * it.qty)}</Typography>
                      <IconButton size="small" onClick={() => removeFromCart(it.id)} sx={{ ml: 1 ,fontFamily: "'Montserrat', sans-serif"}}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontWeight: 700,fontFamily: "'Montserrat', sans-serif" }}>Total</Typography>
            <Typography sx={{ fontWeight: 700,fontFamily: "'Montserrat', sans-serif" }}>{formatMoney(cartTotal)}</Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={checkoutWhatsApp}
            disabled={cart.length === 0}
            sx={{ textTransform: "none", mb: 1, backgroundColor: "#1b3b84",fontFamily: "'Montserrat', sans-serif", "&:hover": { backgroundColor: "#162e6b",fontFamily: "'Montserrat', sans-serif" } }}
          >
            Checkout via WhatsApp
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setCart([]);
              setCartOpen(false);
            }}
            sx={{ textTransform: "none",fontFamily: "'Montserrat', sans-serif" }}
          >
            Clear cart
          </Button>
        </Box>
      </Drawer>

      {/* ---------- Module View Dialog ---------- */}
      <Dialog open={viewDialogOpen} onClose={closeViewDialog} fullWidth maxWidth="sm">
        <DialogTitle>View Module</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Module Title"
              value={viewTitle}
              onChange={(e) => setViewTitle(e.target.value)}
              fullWidth
              InputLabelProps={{ sx: { fontFamily: font } }}
              InputProps={{ sx: { fontFamily: font } }}
            />
            <FormControlLabel
              control={<Checkbox checked={viewFinished} onChange={(e) => setViewFinished(e.target.checked)} />}
              label="Mark as finished"
            />
            <Typography variant="body2" color="text.secondary">
              Edit the module name or mark it as finished. Click Save to persist the changes to the module list.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveViewChanges} sx={{ backgroundColor: "#1b3b84", "&:hover": { backgroundColor: "#162e6b" } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
