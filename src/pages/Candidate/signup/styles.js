// styles.js

export const getStyles = (theme) => ({
  container: {
    justifyContent: "center",
    width: "100%",
    minHeight: "calc(100vh - 64px)",
    px: { xs: 2, sm: 3, md: 5, lg: 10, xl: 15 },
    py: { xs: 4, sm: 5, md: 0, lg: 0, xl: 0 },
  },

  loaderOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  leftPanel: {
    border: `1px solid ${theme.colors.grey[300]}`,
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 2,
    display: { xs: "none", md: "flex", lg: "flex", xl: "flex" },
    alignItems: "center",
    justifyContent: "center",
    px: { md: 3, lg: 4, xl: 6 },
    py: { md: 3, lg: 1, xl: 4 },
  },

  welcomeText: {
    position: "absolute",
    mt: 2,
    ml: { md: 17, lg: 20, xl: 30 },
    fontSize: { md: "22px", lg: "28px", xl: "32px" },
    fontStyle: "italic",
    fontWeight: 500,
  },

  formCard: {
    width: {
      xs: "95%",
      sm: "80%",
      md: "80%",
      lg: "100%",
      xl: "70%",
    },
    p: { xs: 2, sm: 4, lg: 4 },
    pt: { xs: 2, sm: 1, lg: 2 },
    pb: { xs: 2, sm: 1, lg: 2 },
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: { xs: 2, sm: 3, lg: 4 },
    boxShadow: theme.shadows[2],
    mt: { xs: 1, sm: 0 },
    ml: { xl: 12 },
  },

  textField: {
    mb: 2,

    "& .MuiOutlinedInput-root": {
      borderRadius: 1,
      backgroundColor: "#FFFFFF",

      "&:hover fieldset": {
        borderColor: theme.colors.cyan[200],
      },

      "&.Mui-focused fieldset": {
        borderColor: theme.colors.cyan[200],
      },
    },

    "& label": {
      color: "#ADAEBC",
    },
  },

  signupButton: {
    borderRadius: 1,
    backgroundColor: theme.colors.cyan[200],
    color: "#FFFFFF",
    fontWeight: 500,
    textTransform: "none",
    fontSize: { xs: "14px", sm: "16px" },

    "&:hover": {
      backgroundColor: theme.colors.cyan[300],
    },
  },

  googleButton: {
    backgroundColor: "#FFFFFF",
    border: `1px solid ${theme.colors.grey[300]}`,
    color: theme.palette.text.main,
    textTransform: "none",
    borderRadius: "8px",
    fontSize: { xs: "14px", sm: "16px" },

    "&:hover": {
      borderColor: theme.colors.cyan[200],
      backgroundColor: theme.colors.grey[100],
    },

    "& .MuiSvgIcon-root": {
      color: "#DB4437",
      fontSize: 22,
    },
  },

  otpCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    boxShadow: theme.shadows[4],
    p: 4,
    borderRadius: "12px",
    textAlign: "center",
  },

  otpButton: {
    backgroundColor: theme.colors.cyan[200],
    color: "#FFFFFF",
    fontWeight: 500,
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "16px",
    py: 1,
    mb: 2,

    "&:hover": {
      backgroundColor: theme.colors.cyan[300],
    },
  },

  resendButton: {
    borderColor: theme.colors.cyan[200],
    color: theme.colors.cyan[200],
    borderRadius: "8px",
    textTransform: "none",

    "&:hover": {
      borderColor: theme.colors.cyan[300],
      color: theme.colors.cyan[300],
    },
  },

  loginText: {
    fontWeight: 400,
    fontSize: { xs: "12px", sm: "14px" },
    color: "#000",
    mb: 1,
  },

  loginLink: {
    color: theme.colors.cyan[200],
    cursor: "pointer",
    fontWeight: 500,
  },
  microsoftButton: {
  backgroundColor: "#FFFFFF",
  border: `1px solid ${theme.colors.grey[300]}`,
  color: theme.palette.text.main,
  textTransform: "none",
  borderRadius: "8px",
  fontSize: { xs: "14px", sm: "16px" },

  "&:hover": {
    borderColor: theme.colors.cyan[200],
    backgroundColor: theme.colors.grey[100],
  },
},
});