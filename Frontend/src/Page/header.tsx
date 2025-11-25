import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  InputBase,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Button,
  ClickAwayListener,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

// Use exact fontFamily string requested
const Montserrat = "'Montserrat', sans-serif";

// Developer-provided preview image path (will be transformed to URL elsewhere)
const previewImg = "/mnt/data/sdwqdqwd.JPG";

const SearchContainer = styled("div")(() => ({
  position: "relative",
  flexGrow: 1,
  borderRadius: "50px",
  border: "1px solid #ccc",
  backgroundColor: "#E7E5E4",
  display: "flex",
  alignItems: "center",
  maxWidth: 700,
  margin: "0 40px",
  fontFamily: Montserrat,
}));

const StyledInput = styled(InputBase)(() => ({
  flex: 1,
  padding: "10px 16px",
  fontSize: "0.95rem",
  color: "#333",
  fontFamily: Montserrat,
}));

const SearchButton = styled(IconButton)(() => ({
  backgroundColor: "rgb(10, 83, 151)",
  color: "#fff",
  borderRadius: "50%",
  marginRight: "6px",
  "&:hover": {
    backgroundColor: "rgb(10, 83, 151)",
  },
  fontFamily: Montserrat,
}));

export default function EtsyStyleHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const showSearchAndRight = !(isMobile || isTablet);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState<string>("home");

  const [cartItems, setCartItems] = useState<Array<{ id: string; title: string; qty: number }>>([]);

  const categories: { label: string; path: string }[] = [
    { label: "Tamil Courses", path: "/tamil-courses" },
    { label: "Sinhala Courses", path: "/sinhala-courses" },
    { label: "English Courses", path: "/english-courses" },
    { label: "Premium Account Service", path: "/premium-account-service" },
    { label: "Request Service", path: "/request-service" },
  ];

  const logoUrl = "https://i.ibb.co/JRPnDfqQ/cmh6a26eo000h04jmaveg5yzp-removebg-preview.png";

  const isDarkMode = theme.palette.mode === "dark";
  const bgColor = isDarkMode ? "#0f172a" : "#ffffff";
  const iconColor = isDarkMode ? "#cbd5e1" : "#555";

  const navigate = useNavigate();

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const [matches, setMatches] = useState<typeof categories>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Request Service (left dialog) form
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [reqName, setReqName] = useState("");
  const [reqMobile, setReqMobile] = useState("");
  const [reqType, setReqType] = useState("");
  const [reqDesc, setReqDesc] = useState("");
  const [reqErrors, setReqErrors] = useState<{ name?: string; mobile?: string; type?: string; desc?: string }>({});

  // Inquiry (right dialog) form — ORDER fields removed
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [inqName, setInqName] = useState("");
  const [inqMobile, setInqMobile] = useState("");
  const [inqType, setInqType] = useState("");
  const [inqDescription, setInqDescription] = useState("");
  const [inqErrors, setInqErrors] = useState<{ name?: string; mobile?: string; type?: string; description?: string }>({});

  // UI state
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>( {
    open: false,
    message: "",
    severity: "info",
  });

  // Bottom nav handler
  const handleBottomNavClick = (value: string) => {
    setBottomNavValue(value);
    if (value === "categories") setDrawerOpen(true);
    if (value === "chat") window.dispatchEvent(new Event("openInquiry"));
    if (value === "cart") setCartOpen(true);
  };

  // Cart helpers
  const addToCart = (product: { id: string; title: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (id: string) => setCartItems((prev) => prev.filter((p) => p.id !== id));

  // Drawer category click
  const handleCategoryClick = (cat: { label: string; path: string }) => {
    setDrawerOpen(false);
    if (cat.label === "Request Service") {
      setTimeout(() => setRequestDialogOpen(true), 150);
      return;
    }
    navigate(cat.path);
  };

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  // Search matching effect
  useEffect(() => {
    if (!searchTerm.trim()) {
      setMatches([]);
      setResultsOpen(false);
      setHighlightIndex(-1);
      return;
    }
    const q = searchTerm.trim().toLowerCase();
    const m = categories.filter((c) => c.label.toLowerCase().includes(q));
    setMatches(m);
    setResultsOpen(true);
    setHighlightIndex(m.length ? 0 : -1);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (matches.length > 0) setHighlightIndex((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (matches.length > 0) setHighlightIndex((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matches.length > 0) {
        const selected = matches[highlightIndex > -1 ? highlightIndex : 0];
        if (selected.label === "Request Service") setRequestDialogOpen(true);
        else navigate(selected.path);
        setSearchTerm("");
        setResultsOpen(false);
      } else {
        setResultsOpen(true);
      }
    } else if (e.key === "Escape") {
      setResultsOpen(false);
    }
  };

  const onClickAway = (ev?: MouseEvent | TouchEvent) => setResultsOpen(false);

  const handleSelectMatch = (match: { label: string; path: string }) => {
    setSearchTerm("");
    setResultsOpen(false);
    if (match.label === "Request Service") setRequestDialogOpen(true);
    else navigate(match.path);
  };

  // Validation helpers
  const validateRequestForm = () => {
    const errs: typeof reqErrors = {};
    if (!reqName.trim()) errs.name = "Please enter your name";
    if (!reqMobile.trim()) errs.mobile = "Please enter your mobile number";
    const digits = reqMobile.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) errs.mobile = "Enter a valid phone number (include country code if available)";
    if (!reqType) errs.type = "Select a request type";
    if (!reqDesc.trim()) errs.desc = "Describe your request briefly";
    setReqErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateInquiryForm = () => {
    const errs: typeof inqErrors = {};
    if (!inqName.trim()) errs.name = "Please enter name";
    if (!inqMobile.trim()) errs.mobile = "Please enter mobile";
    const digits = inqMobile.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) errs.mobile = "Enter valid phone (include country code)";
    if (!inqType.trim()) errs.type = "Select inquiry type";
    if (!inqDescription.trim()) errs.description = "Please add a description";
    setInqErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // WhatsApp opener — no order number/date, message only contains Name, Mobile, Type and Description
  const openWhatsApp = (messageData: {
    name: string;
    mobile: string;
    requestservicestype: string;
    description: string;
  }) => {
    const message = `*Request / Inquiry Received*\n\n*Name:* ${messageData.name}\n*Mobile:* ${messageData.mobile}\n*Request Type:* ${messageData.requestservicestype}\n\n*Description:*\n${messageData.description}\n\n_Sent via buycourse.lk_`;

    const phone = "94767080553";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Reset helpers
  const resetRequestForm = () => {
    setReqName("");
    setReqMobile("");
    setReqType("");
    setReqDesc("");
    setReqErrors({});
  };
  const resetInquiryForm = () => {
    setInqName("");
    setInqMobile("");
    setInqType("");
    setInqDescription("");
    setInqErrors({});
  };

  // Unified save -> share helper (ORDER fields removed)
  const saveAndShare = async (type: "request" | "inquiry") => {
    if (type === "request") {
      if (!validateRequestForm()) {
        setSnackbar({ open: true, message: "Please fill required fields.", severity: "error" });
        return;
      }
    } else {
      if (!validateInquiryForm()) {
        setSnackbar({ open: true, message: "Please fill required fields.", severity: "error" });
        return;
      }
    }

    const API_HOST = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_API_HOST) as string | undefined;
    if (!API_HOST) {
      setSnackbar({ open: true, message: "API host not configured (VITE_API_HOST).", severity: "error" });
      return;
    }

    setLoading(true);

    // Build payload according to requested schema:
    // required: name, mobile, requestservicestype, description
    const payloadBase: any = {
      name: type === "request" ? reqName : inqName,
      mobile: type === "request" ? reqMobile : inqMobile,
      requestservicestype: type === "request" ? reqType : inqType,
      description: type === "request" ? reqDesc : inqDescription,
    };

    try {
      const resp = await fetch(`${API_HOST}/requestservices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBase),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.message || `Server responded with ${resp.status}`);
      }

      // Optionally use respJson if your backend returns an id
      const respJson = await resp.json().catch(() => null);

      setSnackbar({ open: true, message: "Saved successfully — opening WhatsApp...", severity: "success" });

      const messageData = {
        name: payloadBase.name || "N/A",
        mobile: payloadBase.mobile || "N/A",
        requestservicestype: payloadBase.requestservicestype || "N/A",
        description: payloadBase.description || "N/A",
      };

      setTimeout(() => {
        openWhatsApp(messageData);
        if (type === "request") {
          resetRequestForm();
          setRequestDialogOpen(false);
        } else {
          resetInquiryForm();
          setInquiryDialogOpen(false);
        }
      }, 350);
    } catch (error: any) {
      setSnackbar({ open: true, message: error?.message || "Failed to save.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // allow opening inquiry dialog by event
  useEffect(() => {
    const handler = () => setInquiryDialogOpen(true);
    window.addEventListener("openInquiry", handler);
    return () => window.removeEventListener("openInquiry", handler);
  }, []);

  return (
    <Box sx={{ fontFamily: Montserrat }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#F8FAFC",
          color: "#000",
          px: { xs: 3, sm: 6, md: 10 },
          mt: "55px",
          fontFamily: Montserrat,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 4,
            flexWrap: "wrap",
            py: 1,
            fontFamily: Montserrat,
          }}
        >
          {/* Left Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, fontFamily: Montserrat }}>
            <Link to="/" aria-label="Go to home" style={{ textDecoration: "none", display: "inline-block" }}>
              <Box
                component="img"
                src={logoUrl}
                alt="Logo"
                sx={{
                  height: 80,
                  width: "auto",
                  cursor: "pointer",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Link>

            {showSearchAndRight && (
              <Box
                onClick={() => setDrawerOpen(true)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "0.9rem",
                  color: "#555",
                  cursor: "pointer",
                  fontFamily: Montserrat,
                }}
                aria-label="open categories"
                role="button"
              >
                <MenuIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: Montserrat }}>
                  Categories
                </Typography>
              </Box>
            )}
          </Box>

          {/* Search */}
          {showSearchAndRight && (
            <ClickAwayListener onClickAway={onClickAway}>
              <SearchContainer ref={searchRef}>
                <StyledInput
                  placeholder="Search for anything (e.g. Tamil Courses)"
                  inputProps={{ "aria-label": "search", style: { fontFamily: Montserrat } }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-autocomplete="list"
                  aria-expanded={resultsOpen}
                  aria-haspopup="listbox"
                  role="combobox"
                />
                <SearchButton
                  aria-label="search-button"
                  onClick={() => {
                    if (matches.length > 0) {
                      const selected = matches[highlightIndex > -1 ? highlightIndex : 0];
                      if (selected.label === "Request Service") setRequestDialogOpen(true);
                      else navigate(selected.path);
                      setSearchTerm("");
                      setResultsOpen(false);
                    } else {
                      setResultsOpen(true);
                    }
                  }}
                >
                  <SearchIcon />
                </SearchButton>

                {resultsOpen && (
                  <Box
                    role="listbox"
                    aria-live="polite"
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: "calc(100% + 8px)",
                      background: "#fff",
                      boxShadow: 3,
                      borderRadius: 1,
                      zIndex: (t) => t.zIndex.appBar + 10,
                      maxHeight: 260,
                      overflow: "auto",
                      fontFamily: Montserrat,
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    {matches.length === 0 ? (
                      <Box sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ color: "#666", fontFamily: Montserrat }}>
                          No results for “{searchTerm}”
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#888", fontFamily: Montserrat }}>
                          Try different keywords or check categories.
                        </Typography>
                      </Box>
                    ) : (
                      <List disablePadding>
                        {matches.map((m, idx) => {
                          const isHighlighted = idx === highlightIndex;
                          return (
                            <ListItem key={m.path} disablePadding sx={{ background: isHighlighted ? "rgba(10,83,151,0.08)" : "transparent", fontFamily: Montserrat }}>
                              <ListItemButton onMouseEnter={() => setHighlightIndex(idx)} onClick={() => handleSelectMatch(m)} component="div" sx={{ px: 2, py: 1.25 }}>
                                <ListItemText
                                  primary={m.label}
                                  primaryTypographyProps={{ sx: { fontWeight: 600, fontFamily: Montserrat } }}
                                  secondary={m.path}
                                  secondaryTypographyProps={{ sx: { fontFamily: Montserrat } }}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    )}
                  </Box>
                )}
              </SearchContainer>
            </ClickAwayListener>
          )}

          {/* Right icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, fontFamily: Montserrat }}>
            {showSearchAndRight ? (
              <>
                <IconButton
                  onClick={() => setCartOpen(true)}
                  sx={{
                    bgcolor: "#E7E5E4",
                    borderRadius: "50%",
                    p: 1,
                    "&:hover": { bgcolor: "#dcdcdc" },
                    fontFamily: Montserrat,
                  }}
                  aria-label="open-cart"
                >
                  <Badge badgeContent={cartItems.reduce((s, i) => s + i.qty, 0)} color="error">
                    <ShoppingBagIcon sx={{ color: "#555" }} />
                  </Badge>
                </IconButton>
              </>
            ) : (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#555", fontFamily: Montserrat }} aria-label="open-menu">
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* LEFT Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} ModalProps={{ keepMounted: true }} PaperProps={{ sx: { width: 320, zIndex: (t) => t.zIndex.drawer + 3, fontFamily: Montserrat } }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Link to="/" aria-label="Go to home" style={{ textDecoration: "none", display: "inline-block" }}>
                <Box component="img" src={logoUrl} alt="Logo" sx={{ width: 200, objectFit: "contain" }} />
              </Link>
            </Box>

            <IconButton onClick={() => setDrawerOpen(false)} aria-label="close-categories" sx={{ fontFamily: Montserrat }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 1 }} />

          <List>
            {categories.map((cat) => {
              const isActive = pathname === cat.path;
              return (
                <ListItem disablePadding key={cat.path} sx={{ fontFamily: Montserrat }}>
                  {cat.label === "Request Service" ? (
                    <ListItemButton onClick={() => handleCategoryClick(cat)} selected={isActive} sx={{ textDecoration: "none", color: "inherit", "&.Mui-selected": { backgroundColor: "rgba(0,0,0,0.06)" } }}>
                      <ListItemText primary={cat.label} primaryTypographyProps={{ sx: { fontFamily: Montserrat, fontWeight: isActive ? 700 : 500 } }} />
                    </ListItemButton>
                  ) : (
                    <ListItemButton component={Link} to={cat.path} onClick={() => handleCategoryClick(cat)} selected={isActive} sx={{ textDecoration: "none", color: "inherit", "&.Mui-selected": { backgroundColor: "rgba(0,0,0,0.06)" } }}>
                      <ListItemText primary={cat.label} primaryTypographyProps={{ sx: { fontFamily: Montserrat, fontWeight: isActive ? 700 : 500 } }} />
                    </ListItemButton>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Cart Drawer */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 320, fontFamily: Montserrat, py: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: Montserrat }}>
              Your Cart
            </Typography>
            <Button size="small" onClick={() => setCartItems([])} sx={{ fontFamily: Montserrat }}>
              Clear
            </Button>
          </Box>

          <Divider sx={{ my: 1 }} />

          {cartItems.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center", color: "#666", fontFamily: Montserrat }}>
              <Typography variant="body1" sx={{ fontFamily: Montserrat }}>
                No products available
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontFamily: Montserrat }}>
                Add items to your cart and they'll appear here.
              </Typography>
            </Box>
          ) : (
            <List>
              {cartItems.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", fontFamily: Montserrat }}>
                      <Button size="small" onClick={() => removeFromCart(item.id)} aria-label={`remove-${item.id}`} sx={{ fontFamily: Montserrat }}>
                        -
                      </Button>
                      <Typography sx={{ minWidth: 20, textAlign: "center", fontFamily: Montserrat }}>{item.qty}</Typography>
                      <Button size="small" onClick={() => addToCart({ id: item.id, title: item.title })} aria-label={`add-${item.id}`} sx={{ fontFamily: Montserrat }}>
                        +
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText primary={item.title} primaryTypographyProps={{ sx: { fontWeight: 600, fontFamily: Montserrat } }} />
                </ListItem>
              ))}
            </List>
          )}

          <Box sx={{ px: 2, py: 2 }}>
            <Button fullWidth variant="contained" disabled={cartItems.length === 0} sx={{ fontFamily: Montserrat, background: "rgb(10, 83, 151)" }}>
              Proceed to checkout
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Request Service Dialog (now save -> share) */}
      <Dialog open={requestDialogOpen} onClose={() => setRequestDialogOpen(false)} fullWidth maxWidth="sm" aria-labelledby="request-dialog-title">
        <DialogTitle id="request-dialog-title" sx={{ fontFamily: Montserrat }}>
          Request Service
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, fontFamily: Montserrat }}>
            <TextField
              label="Name"
              value={reqName}
              onChange={(e) => setReqName(e.target.value)}
              error={!!reqErrors.name}
              helperText={reqErrors.name}
              fullWidth
              autoFocus
              InputLabelProps={{ sx: { fontFamily: Montserrat } }}
              InputProps={{ sx: { fontFamily: Montserrat } }}
              FormHelperTextProps={{ sx: { fontFamily: Montserrat } }}
            />
            <TextField
              label="Mobile number (include country code)"
              value={reqMobile}
              onChange={(e) => setReqMobile(e.target.value)}
              error={!!reqErrors.mobile}
              helperText={reqErrors.mobile}
              fullWidth
              InputLabelProps={{ sx: { fontFamily: Montserrat } }}
              InputProps={{ sx: { fontFamily: Montserrat } }}
              FormHelperTextProps={{ sx: { fontFamily: Montserrat } }}
            />
            <FormControl fullWidth error={!!reqErrors.type} sx={{ fontFamily: Montserrat }}>
              <InputLabel id="req-type-label" sx={{ fontFamily: Montserrat }}>
                Request type
              </InputLabel>
              <Select
                labelId="req-type-label"
                label="Request type"
                value={reqType}
                onChange={(e) => setReqType(String(e.target.value))}
                sx={{ fontFamily: Montserrat }}
                inputProps={{ sx: { fontFamily: Montserrat } }}
              >
                <MenuItem value={"New course request"} sx={{ fontFamily: Montserrat }}>
                  New course request
                </MenuItem>
                <MenuItem value={"Premium Account Request"} sx={{ fontFamily: Montserrat }}>
                  Premium Account Request
                </MenuItem>
                <MenuItem value={"Any Licence Service"} sx={{ fontFamily: Montserrat }}>
                  Any Licence Service
                </MenuItem>
              </Select>
              {reqErrors.type && <FormHelperText sx={{ fontFamily: Montserrat }}>{reqErrors.type}</FormHelperText>}
            </FormControl>
            <TextField
              label="Description"
              value={reqDesc}
              onChange={(e) => setReqDesc(e.target.value)}
              error={!!reqErrors.desc}
              helperText={reqErrors.desc || "Give as much detail as needed"}
              multiline
              rows={4}
              fullWidth
              InputLabelProps={{ sx: { fontFamily: Montserrat } }}
              InputProps={{ sx: { fontFamily: Montserrat } }}
              FormHelperTextProps={{ sx: { fontFamily: Montserrat } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRequestDialogOpen(false)} sx={{ fontFamily: Montserrat }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => saveAndShare("request")}
            sx={{ background: "rgb(10, 83, 151)", fontFamily: Montserrat, display: "inline-flex", alignItems: "center", gap: 1 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : null}
            Save & Send via WhatsApp
          </Button>
        </DialogActions>
      </Dialog>

      {/* Inquiry Dialog (single button: save -> open WhatsApp) */}
      <Dialog open={inquiryDialogOpen} onClose={() => setInquiryDialogOpen(false)} fullWidth maxWidth="sm" aria-labelledby="inquiry-dialog-title">
        <DialogTitle id="inquiry-dialog-title" sx={{ fontFamily: Montserrat }}>
          New Inquiry
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2, mt: 1, fontFamily: Montserrat }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Name"
                value={inqName}
                onChange={(e) => setInqName(e.target.value)}
                error={!!inqErrors.name}
                helperText={inqErrors.name}
                fullWidth
                autoFocus
                InputLabelProps={{ sx: { fontFamily: Montserrat } }}
                InputProps={{ sx: { fontFamily: Montserrat } }}
                FormHelperTextProps={{ sx: { fontFamily: Montserrat } }}
              />
              <TextField
                label="Mobile number (include country code)"
                value={inqMobile}
                onChange={(e) => setInqMobile(e.target.value)}
                error={!!inqErrors.mobile}
                helperText={inqErrors.mobile}
                fullWidth
                InputLabelProps={{ sx: { fontFamily: Montserrat } }}
                InputProps={{ sx: { fontFamily: Montserrat } }}
                FormHelperTextProps={{ sx: { fontFamily: Montserrat } }}
              />
              <FormControl fullWidth error={!!inqErrors.type} sx={{ fontFamily: Montserrat }}>
                <InputLabel id="inq-type-label" sx={{ fontFamily: Montserrat }}>
                  Inquiry type
                </InputLabel>
                <Select
                  labelId="inq-type-label"
                  label="Inquiry type"
                  value={inqType}
                  onChange={(e) => setInqType(String(e.target.value))}
                  sx={{ fontFamily: Montserrat }}
                  inputProps={{ sx: { fontFamily: Montserrat } }}
                >
                  <MenuItem value={"Product question"} sx={{ fontFamily: Montserrat }}>
                    Product question
                  </MenuItem>
                  <MenuItem value={"Order issue"} sx={{ fontFamily: Montserrat }}>
                    Order issue
                  </MenuItem>
                  <MenuItem value={"Refund / Return"} sx={{ fontFamily: Montserrat }}>
                    Refund / Return
                  </MenuItem>
                  <MenuItem value={"Other"} sx={{ fontFamily: Montserrat }}>
                    Other
                  </MenuItem>
                </Select>
                {inqErrors.type && <FormHelperText sx={{ fontFamily: Montserrat }}>{inqErrors.type}</FormHelperText>}
              </FormControl>

              <TextField
                label="Description"
                value={inqDescription}
                onChange={(e) => setInqDescription(e.target.value)}
                error={!!inqErrors.description}
                helperText={inqErrors.description || "Give as much detail as needed"}
                multiline
                rows={4}
                fullWidth
                InputLabelProps={{ sx: { fontFamily: Montserrat } }}
                InputProps={{ sx: { fontFamily: Montserrat } }}
                FormHelperTextProps={{ sx: { fontFamily: Montserrat } }}
              />
            </Box>

            <Box sx={{ width: 140, display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ fontFamily: Montserrat, fontSize: "0.85rem", color: "#333", fontWeight: 600 }}>Preview</Box>
              <Box
                component="img"
                src={previewImg}
                alt="Preview"
                sx={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
              <Typography sx={{ fontSize: "0.75rem", color: "#666", fontFamily: Montserrat }}>Message will be sent in the format shown (no order fields).</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setInquiryDialogOpen(false)} sx={{ fontFamily: Montserrat }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => saveAndShare("inquiry")}
            sx={{ background: "rgb(10, 83, 151)", fontFamily: Montserrat, display: "inline-flex", alignItems: "center", gap: 1 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : null}
            Save & Send via WhatsApp
          </Button>
        </DialogActions>
      </Dialog>

      {/* MOBILE / TABLET BOTTOM NAV */}
      {(isMobile || isTablet) && (
        <Paper
          elevation={10}
          sx={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "95%",
            maxWidth: 500,
            bgcolor: bgColor,
            borderRadius: 2,
            p: 1.3,
            fontFamily: Montserrat,
            zIndex: (t) => t.zIndex.drawer + 2,
          }}
        >
          <BottomNavigation
            showLabels
            value={bottomNavValue}
            onChange={(_, newValue) => {
              handleBottomNavClick(String(newValue));
            }}
            sx={{
              bgcolor: "transparent",
              height: 70,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {[
              { label: "Home", value: "home", icon: <HomeIcon /> },
              { label: "Categories", value: "categories", icon: <MenuIcon /> },
              { label: "Cart", value: "cart", icon: <ShoppingBagIcon /> },
              { label: "Chat", value: "chat", icon: <ChatBubbleOutlineIcon /> },
            ].map((item) => (
              <BottomNavigationAction
                key={item.value}
                value={item.value}
                label={item.label}
                icon={
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "50%",
                      bgcolor: bottomNavValue === item.value ? "#000" : "transparent",
                      color: bottomNavValue === item.value ? "#fff" : iconColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        transform: "scale(1.15)",
                        bgcolor: bottomNavValue === item.value ? "#000" : "rgba(0,0,0,0.08)",
                      },
                      fontFamily: Montserrat,
                    }}
                    aria-hidden
                  >
                    {item.icon}
                  </Box>
                }
                sx={{
                  "& .MuiBottomNavigationAction-label": {
                    fontFamily: Montserrat,
                    fontSize: "0.7rem",
                    marginTop: "4px",
                    color: bottomNavValue === item.value ? "#000" : "#777",
                  },
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ fontFamily: Montserrat }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
