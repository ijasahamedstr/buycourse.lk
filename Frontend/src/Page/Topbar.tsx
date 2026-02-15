/**
 * ============================================================================
 * COMPONENT: Topbar
 * VERSION: 7.1.0 (Refined)
 * DESCRIPTION: Professional responsive header with optimized Inquiry Modal.
 * THEME: Deep Blue (#0A5397) | Onyx Glassmorphism
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
  Menu as MenuIcon, // Changed from LanguageIcon for better UX on mobile
} from "@mui/icons-material";

// --- GLOBAL CONFIGURATION ---

const MONTSERRAT = '"Montserrat", sans-serif';
const BRAND_PRIMARY = "rgb(10, 83, 151)";
const BRAND_DARK = "#0f172a";

const CART_KEY = "cartCourses";
const OTT_CART_KEY = "ottCart";

const INQUIRY_OPTIONS = [
  { value: "Payment Issue", label: "Payment & Billing" },
  { value: "Product Issue", label: "Product & Course Access" },
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Request Service", label: "Technical Support" },
];

// --- STYLED COMPONENTS ---

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
  background: scrolled ? alpha("#000", 0.90) : alpha("#0f172a", 0.95),
  backdropFilter: "blur(12px)",
  borderBottom: `1px solid ${alpha("#fff", 0.08)}`,
  boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.5)" : "none",
}));

const SocialLink = styled(Link)<{ bgcolor: string }>(({ bgcolor }) => ({
  width: 32,
  height: 32,
  borderRadius: "8px",
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
    transform: "translateY(-3px)",
    boxShadow: `0 4px 12px ${alpha(bgcolor, 0.4)}`,
  },
}));

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "550px",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: theme.spacing(3.5),
  boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  outline: "none",
  maxHeight: "90vh", 
  overflowY: "auto",
  // Custom Scrollbar
  "&::-webkit-scrollbar": { width: "6px" },
  "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "4px" },
  "&::-webkit-scrollbar-thumb": { background: "#c1c1c1", borderRadius: "4px" },
  "&::-webkit-scrollbar-thumb:hover": { background: "#a8a8a8" },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2.5),
    width: "95%",
    borderRadius: "16px",
    maxHeight: "95vh",
  },
}));

const PrimaryCTA = styled(Button)(({ theme }) => ({
  borderRadius: "50px",
  textTransform: "none",
  fontWeight: 700,
  fontFamily: MONTSERRAT,
  padding: "8px 22px",
  backgroundColor: BRAND_PRIMARY,
  color: "#fff",
  boxShadow: `0 4px 14px ${alpha(BRAND_PRIMARY, 0.4)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgb(13, 100, 180)",
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px ${alpha(BRAND_PRIMARY, 0.5)}`,
  },
  [theme.breakpoints.down("sm")]: {
    padding: "6px 16px",
    fontSize: "0.8rem",
  },
}));

// --- MAIN COMPONENT ---

const Topbar: React.FC = () => {
  const theme = useTheme();
  
  // Responsive Breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // State
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

  // Utilities
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

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    const onTriggerInquiry = () => setOpen(true);
    window.addEventListener("openInquiry", onTriggerInquiry);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("openInquiry", onTriggerInquiry);
    };
  }, []);

  // Handlers
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
      setToast({ show: true, msg: "Please fill in Name, Mobile, and Category.", type: "error" });
      return;
    }

    const API_HOST = import.meta.env.VITE_API_HOST as string | undefined;
    if (!API_HOST) {
      // Fallback if API not configured
      setToast({ show: true, msg: "Redirecting to WhatsApp...", type: "success" });
      setTimeout(() => {
          handleWhatsAppRedirect();
          setOpen(false);
      }, 1000);
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
        throw new Error(`Server Error`);
      }

      setToast({ show: true, msg: "Inquiry Saved. Opening WhatsApp...", type: "success" });

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
        msg: "Cloud sync failed. Opening WhatsApp fallback...", 
        type: "error" 
      });
      setTimeout(() => {
        handleWhatsAppRedirect();
        setLoading(false);
        setOpen(false);
      }, 1500);
    }
  };

  // Memoized Input Props
  const textFieldProps = useMemo(() => ({
    fullWidth: true,
    variant: "filled" as const,
    InputLabelProps: { sx: { fontFamily: MONTSERRAT, fontSize: '0.85rem', color: '#64748b' } },
    InputProps: { 
        disableUnderline: true, 
        sx: { 
            borderRadius: '10px', 
            fontFamily: MONTSERRAT, 
            backgroundColor: "#f1f5f9",
            border: "1px solid transparent",
            transition: "all 0.2s",
            "&:hover": { backgroundColor: "#e2e8f0" },
            "&.Mui-focused": { 
                backgroundColor: "#fff", 
                border: `1px solid ${BRAND_PRIMARY}`,
                boxShadow: `0 0 0 2px ${alpha(BRAND_PRIMARY, 0.1)}`
            }
        } 
    },
  }), []);

  return (
    <>
      {/* --- HEADER --- */}
      <NavWrapper scrolled={scrolled ? 1 : 0}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            
            {/* Left Identity */}
            <Stack direction="row" spacing={isMobile ? 1 : 4} alignItems="center">
              <Box display="flex" alignItems="center" sx={{ color: "#fff", cursor: 'default' }}>
                <SupportIcon sx={{ mr: 1, color: BRAND_PRIMARY, fontSize: isMobile ? "1.4rem" : "1.8rem" }} />
                <Box>
                  <Typography variant="body2" sx={{ fontFamily: MONTSERRAT, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1, fontSize: isMobile ? "0.8rem" : "0.95rem" }}>
                    SUPPORT CENTER
                  </Typography>
                  {!isMobile && (
                    <Typography variant="caption" sx={{ fontFamily: MONTSERRAT, color: alpha("#fff", 0.5), fontSize: "0.7rem" }}>
                      Official Gateway
                    </Typography>
                  )}
                </Box>
              </Box>

              {!isMobile && (
                <Stack direction="row" spacing={3} sx={{ pt: 0.5 }}>
                  <Link href="tel:+94767080553" sx={{ color: alpha("#fff", 0.7), fontSize: "0.8rem", textDecoration: "none", display: "flex", alignItems: "center", "&:hover": { color: "#fff" } }}>
                    <PhoneIcon sx={{ fontSize: "0.9rem", mr: 0.8 }} /> +94 76 708 0553
                  </Link>
                  {isLargeDesktop && (
                    <Link href="mailto:info@buycourse.lk" sx={{ color: alpha("#fff", 0.7), fontSize: "0.8rem", textDecoration: "none", display: "flex", alignItems: "center", "&:hover": { color: "#fff" } }}>
                      <EmailIcon sx={{ fontSize: "0.9rem", mr: 0.8 }} /> info@buycourse.lk
                    </Link>
                  )}
                </Stack>
              )}
            </Stack>

            {/* Right Actions */}
            <Stack direction="row" spacing={isMobile ? 1 : 2} alignItems="center">
              {!isTablet ? (
                <Stack direction="row" spacing={1}>
                  <Tooltip title="WhatsApp">
                    <SocialLink bgcolor="#25D366" href="https://wa.me/94767080553" target="_blank"><WhatsAppIcon sx={{ fontSize: 16 }} /></SocialLink>
                  </Tooltip>
                  <Tooltip title="Facebook">
                    <SocialLink bgcolor="#1877F2" href="https://facebook.com" target="_blank"><FacebookIcon sx={{ fontSize: 16 }} /></SocialLink>
                  </Tooltip>
                  <Tooltip title="Instagram">
                    <SocialLink bgcolor="#E4405F" href="https://instagram.com" target="_blank"><InstagramIcon sx={{ fontSize: 16 }} /></SocialLink>
                  </Tooltip>
                  <Tooltip title="YouTube">
                    <SocialLink bgcolor="#FF0000" href="https://youtube.com" target="_blank"><YouTubeIcon sx={{ fontSize: 16 }} /></SocialLink>
                  </Tooltip>
                </Stack>
              ) : (
                <IconButton 
                  onClick={() => setDrawerOpen(true)} 
                  sx={{ color: "#fff", bgcolor: alpha("#fff", 0.1), "&:hover": { bgcolor: alpha("#fff", 0.2) } }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <PrimaryCTA 
                onClick={() => setOpen(true)} 
                startIcon={!isMobile && <SendIcon sx={{ fontSize: '1rem !important' }} />}
              >
                Inquire Now
              </PrimaryCTA>
            </Stack>
          </Box>
        </Container>
      </NavWrapper>

      {/* --- MOBILE DRAWER --- */}
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        PaperProps={{ 
          sx: { 
            width: 280, 
            bgcolor: "#0f172a", 
            color: "#fff", 
            p: 3,
            borderLeft: "1px solid rgba(255,255,255,0.1)"
          } 
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h6" sx={{ fontFamily: MONTSERRAT, fontWeight: 700 }}>Quick Links</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}><CloseIcon /></IconButton>
        </Box>
        
        <Stack spacing={2}>
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.4), fontFamily: MONTSERRAT, textTransform: "uppercase" }}>Social Channels</Typography>
          {[
            { label: "WhatsApp", icon: <WhatsAppIcon />, color: "#25D366", link: "https://wa.me/94767080553" },
            { label: "Facebook", icon: <FacebookIcon />, color: "#1877F2", link: "https://facebook.com" },
            { label: "Instagram", icon: <InstagramIcon />, color: "#E4405F", link: "https://instagram.com" },
            { label: "YouTube", icon: <YouTubeIcon />, color: "#FF0000", link: "https://youtube.com" }
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
                color: "#cbd5e1", 
                fontFamily: MONTSERRAT, 
                py: 1.5, 
                px: 2,
                borderRadius: "10px", 
                bgcolor: alpha(item.color, 0.05),
                "&:hover": { bgcolor: alpha(item.color, 0.15), color: "#fff" } 
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Box sx={{ mt: 'auto', pt: 4, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
           <Typography variant="body2" sx={{ color: "#fff", mb: 1, fontFamily: MONTSERRAT }}>Contact Direct</Typography>
           <Link href="tel:+94767080553" underline="none" sx={{ color: alpha("#fff", 0.6), fontSize: "0.85rem", display: 'block', mb: 1, fontFamily: MONTSERRAT }}>+94 76 708 0553</Link>
           <Link href="mailto:info@buycourse.lk" underline="none" sx={{ color: alpha("#fff", 0.6), fontSize: "0.85rem", display: 'block', fontFamily: MONTSERRAT }}>info@buycourse.lk</Link>
        </Box>
      </Drawer>

      {/* --- INQUIRY FORM MODAL --- */}
      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        closeAfterTransition 
        BackdropComponent={Backdrop} 
        BackdropProps={{ timeout: 500, sx: { backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0,0,0,0.6)' } }}
      >
        <Fade in={open}>
          <StyledModalBox>
            
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: MONTSERRAT, color: BRAND_DARK }}>
                  Inquiry Form
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontFamily: MONTSERRAT, color: 'text.secondary', fontSize: '0.85rem' }}>
                  Please fill in the details below.
                </Typography>
              </Box>
              <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#94a3b8' }}><CloseIcon /></IconButton>
            </Box>
            
            <Divider sx={{ mb: 3, borderColor: '#e2e8f0' }} />

            {/* Form Fields Stack */}
            <Stack spacing={2.5}>
              <TextField {...textFieldProps} label="Full Name" name="name" value={form.name} onChange={handleInputChange} />
              
              <TextField {...textFieldProps} label="Mobile Number" name="mobile" value={form.mobile} onChange={handleInputChange} />
              
              <TextField 
                {...textFieldProps} 
                select 
                label="Inquiry Category" 
                name="type" 
                value={form.type} 
                onChange={handleInputChange}
                SelectProps={{ MenuProps: { PaperProps: { sx: { borderRadius: '12px', mt: 1, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } } } }}
              >
                {INQUIRY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontFamily: MONTSERRAT, fontSize: '0.9rem', py: 1.5 }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2.5 : 2}>
                <TextField {...textFieldProps} label="Order ID (Optional)" name="orderId" value={form.orderId} onChange={handleInputChange} />
                <TextField 
                  {...textFieldProps} 
                  type="date" 
                  label="Purchase Date" 
                  name="orderDate" 
                  value={form.orderDate} 
                  onChange={handleInputChange} 
                  InputLabelProps={{ shrink: true, sx: { fontFamily: MONTSERRAT, color: '#64748b' } }} 
                />
              </Stack>

              <TextField {...textFieldProps} multiline rows={3} label="Message / Description" name="description" value={form.description} onChange={handleInputChange} />
            </Stack>

            <Box mt={4}>
              <Button 
                fullWidth 
                disabled={loading}
                onClick={handleInquirySubmit}
                startIcon={!loading && <WhatsAppIcon />}
                sx={{ 
                  py: 1.8, 
                  borderRadius: "12px", 
                  bgcolor: "#25D366", 
                  color: "#fff", 
                  fontWeight: 700, 
                  fontFamily: MONTSERRAT, 
                  textTransform: "none", 
                  fontSize: "1rem",
                  boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                  "&:hover": { bgcolor: "#1ebc57", boxShadow: "0 6px 15px rgba(37, 211, 102, 0.4)" },
                  "&.Mui-disabled": { bgcolor: "#cbd5e1", color: "#fff" }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit & Open WhatsApp"}
              </Button>
              
              <Typography variant="caption" align="center" sx={{ display: 'block', mt: 2, color: '#94a3b8', fontFamily: MONTSERRAT, fontSize: '0.75rem' }}>
                <SafeIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5, color: BRAND_PRIMARY }} />
                Your data is securely processed via our gateway.
              </Typography>
            </Box>

          </StyledModalBox>
        </Fade>
      </Modal>

      {/* --- SNACKBAR --- */}
      <Snackbar 
        open={toast.show} 
        autoHideDuration={4000} 
        onClose={() => setToast(t => ({ ...t, show: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setToast(t => ({ ...t, show: false }))} 
          severity={toast.type} 
          variant="filled" 
          sx={{ width: "100%", borderRadius: "10px", fontFamily: MONTSERRAT, fontWeight: 600 }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Topbar;