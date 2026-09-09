export const getStyles = (theme) => ({
  container: {
    bgcolor: "#fff",
    borderRadius: 2,
    p: 2.5,
    mb: 2,
    boxShadow: 1,
    minHeight: 180,
    mt: 7,
  },

  title: {
    fontSize: { lg: "25px" },
  },

  avatarWrapper: {
    position: "relative",
    display: "inline-block",
  },

  avatar: {
    width: { xs: 90, sm: 110 },
    height: { xs: 90, sm: 110 },
    border: "3px solid #2B6F71",
    borderRadius: "50%",
    cursor: "pointer",
  },

  uploadIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    bgcolor: "white",
    borderRadius: "50%",
    boxShadow: 1,
    p: 0.5,
  },

  nameText: {
    fontWeight: 700,
    fontSize: { xs: 16, sm: 20 },
    color: "text.primary",
    lineHeight: 1.3,
  },

  editIconButton: {
    bgcolor: "#2B6F71",
    color: "#fff",
    borderRadius: "6px",
    width: 26,
    height: 26,
    ml: 0.5,
    "&:hover": {
      bgcolor: "#1F5557",
    },
  },

  editIcon: {
    fontSize: "15px",
  },

  subText: {
    color: "text.secondary",
    fontSize: { xs: 12, sm: 14 },
    mt: 0.3,
    lineHeight: 1.4,
  },

  lastUpdatedText: {
    color: "text.secondary",
    fontSize: { xs: 11, sm: 13 },
    whiteSpace: "nowrap",
    ml: { xs: 0, sm: "auto" },
    alignSelf: { xs: "flex-start", sm: "flex-start" },
  },

  infoColumnLeft: {
    pr: { sm: 3 },
  },

  infoColumnRight: {
    pl: { sm: 3 },
    borderLeft: { xs: "none", sm: "1px solid #E5E7EB" },
  },

  infoRowIcon: {
    fontSize: "18px",
    color: "#6B7280",
  },

  infoRowText: {
    color: "text.secondary",
    fontSize: { xs: 12, sm: 14, md: 15 },
  },

  aboutText: {
    color: "text.secondary",
    fontSize: {
      xs: 12,
      sm: 14,
    },
    whiteSpace: "pre-line",
  },

  seeMoreButton: {
    mt: 0.5,
    p: 0,
    textTransform: "none",
    fontSize: {
      xs: 12,
      sm: 16,
    },
  },

  imageAvatar: {
    width: 100,
    height: 100,
    border: "2px solid #4CAF50",
    borderRadius: "50%",
  },

  replacePhotoButton: {
    mt: 2,
    mb: 1,
    bgcolor: "#2B6F71",
    color: "#fff",
    "&:hover": {
      bgcolor: "#1F5557",
    },
  },

  errorText: {
    mt: 1,
  },

  dialogPaper: {
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0px 12px 40px rgba(0,0,0,0.15)",
  },

  dialogHeader: {
    background: "linear-gradient(135deg, #2b6f71,#1F5557 )",
    color: "#fff",
    py: 2.5,
    px: 3,
    fontWeight: 600,
    position: "relative",
  },

  dialogContent: {
    p: 3,
    paddingTop: 4,
  },

  dialogFooter: {
    px: 3,
    py: 2,
    borderTop: "1px solid #f0f0f0",
  },

  dialogTextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fafafa",
    },
    "& .MuiInputLabel-root": {
      backgroundColor: "#fff",
      px: 0.5,
    },
  },

  cancelButton: {
    bgcolor: "#E5E7EB",
    color: "#374151",
    borderRadius: "10px",
    px: 3,
  },

  updateButton: {
    background: "linear-gradient(135deg,#2b6f71,#0097A7)",
    color: "#fff",
    borderRadius: "10px",
    px: 4,
    textTransform: "none",
    fontWeight: 600,
    "&:hover": {
      background: "linear-gradient(135deg,#2b6f71,#00838F)",
    },
  },
});