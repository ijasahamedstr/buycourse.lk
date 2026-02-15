/**
 * ============================================================================
 * COMPONENT: Topbar
 * VERSION: 7.0.0
 * DESCRIPTION: Professional responsive header with Inquiry System.
 * THEME: Deep Blue (#0A5397) | Onyx Glassmorphism
 * RESPONSIVENESS: Mobile (xs), Tablet (sm/md), Desktop (lg/xl)
 * ============================================================================
 */

import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo 
} from "react";
import {
  Box,
  Typography,
  Link,
  Button,
  Modal,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
  Drawer,
  IconButton,
  Container,
  Stack,
  Fade,
  Backdrop,
  Divider,
  styled,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SupportAgent as SupportIcon,
  VerifiedUser as SafeIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";

// --- GLOBAL CONFIGURATION & TYPES ---

const MONTSERRAT = '"Montserrat", sans-serif';
const BRAND_PRIMARY = "rgb(10, 83, 151)";
const BRAND_DARK = "#121212";

// Storage keys used across the application architecture
const CART_KEY = "cartCourses";
const OTT_CART_KEY = "ottCart";

const INQUIRY_OPTIONS = [
  { value: "Payment Issue", label: "Payment & Billing" },
  { value: "Product Issue", label: "Product & Course Access" },
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Request Service", label: "Technical Support" },
];

// --- STYLED COMPONENTS (PERFORMANCE OPTIMIZED) ---

/**
 * Premium Navbar Wrapper with dynamic glassmorphism and scroll-sensing logic.
 */
const NavWrapper = styled(Box)<{ scrolled: number }>(({ scrolled }) => ({
  width: "100%",
  height: scrolled ? "60px" : "75px",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1300,
  display: "flex",
  alignItems: "center",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  background: scrolled ? alpha("#000", 0.95) : alpha("#1A1A1A", 0.9),
  backdropFilter: "blur(12px)",
  borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
  boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.5)" : "none",
}));

/**
 * Social Link components with Squircle geometry and brand-specific hover transitions.
 */
const SocialLink = styled(Link)<{ bgcolor: string }>(({ bgcolor }) => ({
  width: 34,
  height: 34,
  borderRadius: "10px",
  backgroundColor: alpha(bgcolor, 0.1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  border: `1px solid ${alpha(bgcolor, 0.2)}`,
  transition: "all 0.3s ease",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: bgcolor,
    transform: "translateY(-4px)",
    boxShadow: `0 8px 15px ${alpha(bgcolor, 0.5)}`,
  },
}));

/**
 * Responsive Modal Box with strict padding and viewport-aware sizing.
 */
const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "92%",
  maxWidth: "540px",
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  padding: theme.spacing(4),
  boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  outline: "none",
  overflowY: "auto",
  maxHeight: "95vh", 
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    borderRadius: "20px",
    width: "95%",
  },
}));

/**
 * Primary Call-To-Action with custom depth shadowing.
 */
const PrimaryCTA = styled(Button)(({ }) => ({
  borderRadius: "50px",
  textTransform: "none",
  fontWeight: 700,
  fontFamily: MONTSERRAT,
  padding: "10px 24px",
  backgroundColor: BRAND_PRIMARY,
  color: "#fff",
  boxShadow: `0 4px 14px ${alpha(BRAND_PRIMARY, 0.4)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgb(13, 100, 180)",
    transform: "scale(1.03)",
  },
}));

// --- MAIN COMPONENT IMPLEMENTATION ---

const Topbar: React.FC = () => {
  const theme = useTheme();
  
  // High-precision Media Queries for Adaptive UI
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // --- STATE MANAGEMENT ---
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState({ 
    show: false, 
    msg: "", 
    type: "success" as "success" | "error" 
  });

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    type: "",
    description: "",
    orderId: "",
    orderDate: ""
  });

  // --- PERSISTENCE & UTILITIES ---

  const resetForm = useCallback(() => {
    setForm({
      name: "",
      mobile: "",
      type: "",
      description: "",
      orderId: "",
      orderDate: ""
    });
  }, []);

  const clearStorageData = useCallback(() => {
    try {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(OTT_CART_KEY);
      window.dispatchEvent(new Event("cartCleared"));
    } catch (error) {
      console.error("Local Storage sync error:", error);
    }
  }, []);

  // --- EFFECT HOOKS ---

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    const onTriggerInquiry = () => setOpen(true);
    window.addEventListener("openInquiry", onTriggerInquiry);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("openInquiry", onTriggerInquiry);
    };
  }, []);

  // --- FORM LOGIC ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppRedirect = useCallback(() => {
    const message = 
      `*NEW INQUIRY: BUYCOURSE.LK*\n\n` +
      `*Client:* ${form.name || "N/A"}\n` +
      `*Mobile:* ${form.mobile || "N/A"}\n` +
      `*Category:* ${form.type || "N/A"}\n` +
      `*Ref Order:* ${form.orderId || "N/A"}\n` +
      `*Purchase Date:* ${form.orderDate || "N/A"}\n\n` +
      `*Description:*\n${form.description || "N/A"}\n\n` +
      `_Sent via official support gateway_`;

    const phoneNumber = "94767080553";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  }, [form]);

  const handleInquirySubmit = async () => {
    if (!form.name || !form.mobile || !form.type) {
      setToast({ show: true, msg: "Please provide Name, Mobile, and Category.", type: "error" });
      return;
    }

    const API_HOST = import.meta.env.VITE_API_HOST as string | undefined;
    if (!API_HOST) {
      setToast({ show: true, msg: "Configuration Error: API Gateway Missing.", type: "error" });
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name,
      mobile: form.mobile,
      inquirytype: form.type,
      ordernumber: form.orderId,
      orderdate: form.orderDate,
      description: form.description,
    };

    try {
      const response = await fetch(`${API_HOST}/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Gateway Error: ${response.status}`);
      }

      setToast({ show: true, msg: "Inquiry Synced. Connecting to WhatsApp...", type: "success" });

      setTimeout(() => {
        handleWhatsAppRedirect();
        clearStorageData();
        resetForm();
        setOpen(false);
        setLoading(false);
      }, 500);

    } catch (err: any) {
      setToast({ 
        show: true, 
        msg: err?.message || "Cloud sync failed. Opening WhatsApp fallback...", 
        type: "error" 
      });
      setTimeout(() => {
        handleWhatsAppRedirect();
        setLoading(false);
      }, 1000);
    }
  };

  // --- SUB-COMPONENTS & MEMOIZED RENDERERS ---

  const textFieldProps = useMemo(() => ({
    fullWidth: true,
    variant: "filled" as const,
    InputLabelProps: { sx: { fontFamily: MONTSERRAT, fontSize: '0.9rem' } },
    InputProps: { 
        disableUnderline: true, 
        sx: { borderRadius: '12px', fontFamily: MONTSERRAT, backgroundColor: alpha('#000', 0.04) } 
    },
    sx: { mb: 2.5 }
  }), []);

  return (
    <>
      {/* --- MAIN HEADER LAYER --- */}
      <NavWrapper scrolled={scrolled ? 1 : 0}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            
            <Stack direction="row" spacing={isMobile ? 1 : 4} alignItems="center">
              <Box display="flex" alignItems="center" sx={{ color: "#fff" }}>
                <SupportIcon sx={{ mr: 1, color: BRAND_PRIMARY, fontSize: isMobile ? "1.2rem" : "1.6rem" }} />
                <Typography variant="body2" sx={{ fontFamily: MONTSERRAT, fontWeight: 800, letterSpacing: 1, fontSize: isMobile ? "0.75rem" : "0.9rem" }}>
                  {isMobile ? "OFFICIAL SUPPORT" : "OFFICIAL SUPPORT GATEWAY"}
                </Typography>
              </Box>

              {!isMobile && (
                <Stack direction="row" spacing={3}>
                  <Link href="tel:+94767080553" sx={{ color: alpha("#fff", 0.75), fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", transition: "0.2s", "&:hover": { color: "#fff" } }}>
                    <PhoneIcon sx={{ fontSize: "1rem", mr: 0.8 }} /> +94 76 708 0553
                  </Link>
                  {isLargeDesktop && (
                    <Link href="mailto:info@buycourse.lk" sx={{ color: alpha("#fff", 0.75), fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", transition: "0.2s", "&:hover": { color: "#fff" } }}>
                      <EmailIcon sx={{ fontSize: "1rem", mr: 0.8 }} /> info@buycourse.lk
                    </Link>
                  )}
                </Stack>
              )}
            </Stack>

            <Stack direction="row" spacing={isMobile ? 1 : 2} alignItems="center">
              {!isTablet ? (
                <Stack direction="row" spacing={1.5}>
                  <Tooltip title="Chat via WhatsApp" arrow>
                    <SocialLink bgcolor="#25D366" href="https://wa.me/94767080553" target="_blank"><WhatsAppIcon sx={{ fontSize: 18 }} /></SocialLink>
                  </Tooltip>
                  <Tooltip title="Follow on Facebook" arrow>
                    <SocialLink bgcolor="#1877F2" href="https://facebook.com" target="_blank"><FacebookIcon sx={{ fontSize: 18 }} /></SocialLink>
                  </Tooltip>
                  <Tooltip title="Follow on Instagram" arrow>
                    <SocialLink bgcolor="#E4405F" href="https://instagram.com" target="_blank"><InstagramIcon sx={{ fontSize: 18 }} /></SocialLink>
                  </Tooltip>
                  <Tooltip title="Visit YouTube" arrow>
                    <SocialLink bgcolor="#FF0000" href="https://youtube.com" target="_blank"><YouTubeIcon sx={{ fontSize: 18 }} /></SocialLink>
                  </Tooltip>
                </Stack>
              ) : (
                <IconButton 
                  onClick={() => setDrawerOpen(true)} 
                  sx={{ color: BRAND_PRIMARY, bgcolor: alpha(BRAND_PRIMARY, 0.1), "&:hover": { bgcolor: alpha(BRAND_PRIMARY, 0.2) } }}
                >
                  <LanguageIcon />
                </IconButton>
              )}

              <PrimaryCTA 
                onClick={() => setOpen(true)} 
                startIcon={!isMobile && <SendIcon sx={{ fontSize: '1.1rem !important' }} />}
                sx={{ fontSize: isMobile ? '0.75rem' : '0.85rem', px: isMobile ? 2 : 3 }}
              >
                Inquire Here
              </PrimaryCTA>
            </Stack>
          </Box>
        </Container>
      </NavWrapper>

      {/* --- MOBILE/TABLET DRAWER NAVIGATION --- */}
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        PaperProps={{ sx: { width: 300, bgcolor: "#111827", color: "#fff", p: 4, backgroundImage: 'none' } }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Typography variant="h6" sx={{ fontFamily: MONTSERRAT, fontWeight: 900, letterSpacing: 1 }}>Connect</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff", bgcolor: alpha('#fff', 0.05) }}><CloseIcon /></IconButton>
        </Box>
        
        <Stack spacing={3}>
          <Typography variant="overline" sx={{ color: alpha('#fff', 0.4), letterSpacing: 2, fontFamily: MONTSERRAT }}>Official Channels</Typography>
          {[
            { label: "WhatsApp Gateway", icon: <WhatsAppIcon />, color: "#25D366", link: "https://wa.me/94767080553" },
            { label: "Facebook Community", icon: <FacebookIcon />, color: "#1877F2", link: "https://facebook.com" },
            { label: "Instagram Feed", icon: <InstagramIcon />, color: "#E4405F", link: "https://instagram.com" },
            { label: "YouTube Channel", icon: <YouTubeIcon />, color: "#FF0000", link: "https://youtube.com" }
          ].map((item) => (
            <Button 
              key={item.label} 
              fullWidth 
              component={Link}
              href={item.link}
              target="_blank"
              startIcon={item.icon} 
              sx={{ 
                justifyContent: "flex-start", 
                color: "#fff", 
                fontFamily: MONTSERRAT, 
                py: 2, 
                px: 3,
                borderRadius: "14px", 
                border: `1px solid ${alpha(item.color, 0.4)}`, 
                textTransform: 'none',
                "&:hover": { bgcolor: alpha(item.color, 0.1), border: `1px solid ${item.color}` } 
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Box sx={{ mt: 'auto', textAlign: 'center', opacity: 0.3 }}>
          <Typography variant="caption" sx={{ fontFamily: MONTSERRAT }}>
            © 2026 buycourse.lk | Secure Support
          </Typography>
        </Box>
      </Drawer>

      {/* --- MODAL INQUIRY FORM ARCHITECTURE --- */}
  <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        closeAfterTransition 
        BackdropComponent={Backdrop} 
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <StyledModalBox>
            {/* Header with Space Between */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: MONTSERRAT, color: BRAND_DARK, fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
                  Submit Inquiry
                </Typography>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, fontFamily: MONTSERRAT, color: 'text.secondary' }}>
                  <SafeIcon sx={{ fontSize: 14, mr: 0.8, color: BRAND_PRIMARY }} /> Secure Encrypted Communication
                </Typography>
              </Box>
              <IconButton onClick={() => setOpen(false)} size="small" sx={{ mt: -1 }}><CloseIcon /></IconButton>
            </Box>
            
            <Divider sx={{ mb: 3 }} />

            {/* Form Fields with consistent side spacing */}
            <Box sx={{ width: '100%' }}>
              <TextField {...textFieldProps} label="Full Name" name="name" value={form.name} onChange={handleInputChange} />
              <TextField {...textFieldProps} label="Mobile Number" name="mobile" value={form.mobile} onChange={handleInputChange} />
              
              <TextField 
                {...textFieldProps} 
                select 
                label="Inquiry Category" 
                name="type" 
                value={form.type} 
                onChange={handleInputChange}
                SelectProps={{ MenuProps: { PaperProps: { sx: { borderRadius: '12px' } } } }}
              >
                {INQUIRY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontFamily: MONTSERRAT, fontSize: '0.9rem' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Stack for Order ID/Date - Dynamic spacing for all devices */}
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={isMobile ? 0 : 2} 
                sx={{ width: '100%' }}
              >
                <TextField {...textFieldProps} label="Order ID (Optional)" name="orderId" value={form.orderId} onChange={handleInputChange} />
                <TextField 
                  {...textFieldProps} 
                  type="date" 
                  label="Order Date" 
                  name="orderDate" 
                  value={form.orderDate} 
                  onChange={handleInputChange} 
                  InputLabelProps={{ shrink: true, sx: { fontFamily: MONTSERRAT } }} 
                />
              </Stack>

              <TextField {...textFieldProps} multiline rows={3} label="Description" name="description" value={form.description} onChange={handleInputChange} />
            </Box>

            <Button 
              fullWidth 
              disabled={loading}
              onClick={handleInquirySubmit}
              sx={{ 
                py: 2, borderRadius: "12px", bgcolor: BRAND_PRIMARY, color: "#fff", fontWeight: 700, fontFamily: MONTSERRAT, textTransform: "none", fontSize: "1rem",
                "&:hover": { bgcolor: "rgb(8, 70, 130)" },
                "&.Mui-disabled": { bgcolor: alpha(BRAND_PRIMARY, 0.3), color: "#fff" }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Verify & Send via WhatsApp"}
            </Button>
          </StyledModalBox>
        </Fade>
      </Modal>

      {/* --- NOTIFICATION GATEWAY --- */}
      <Snackbar 
        open={toast.show} 
        autoHideDuration={5000} 
        onClose={() => setToast(t => ({ ...t, show: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setToast(t => ({ ...t, show: false }))} 
          severity={toast.type} 
          variant="filled" 
          sx={{ width: "100%", borderRadius: "12px", fontFamily: MONTSERRAT, fontWeight: 700, boxShadow: theme.shadows[10] }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Topbar;

/**
 * ============================================================================
 * END OF COMPONENT: Topbar
 * ============================================================================
 */