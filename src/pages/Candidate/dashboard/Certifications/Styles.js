// styles.js

export const getStyles = (theme) => ({
  container: {
    bgcolor: "#fff",
    borderRadius: 2,
    p: 2,
    mb: 2,
    boxShadow: 1,
  },

  sectionTitle: {
    fontSize: {
      xs: 12,
      sm: 12,
      md: 16,
    },
  },

  addButton: {
    background: "rgba(0, 187, 212, 1)",
    fontSize: {
      xs: 10,
      sm: 12,
      md: 16,
    },

    "&:hover": {
      background: "rgba(0, 160, 180, 1)",
    },
  },

  emptyStateButton: {
    color: "rgba(0, 187, 212, 1)",
  },

  certificationList: {
    mt: 2,
    p: 2,
    border: "1px solid #e0e0e0",
    borderRadius: 1,
  },

  certificationItem: (isLast) => ({
    mb: 1,
    borderBottom: isLast ? "none" : "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  }),

  certificationContent: {
    gap: 0.5,
    display: "flex",
    flexDirection: "column",
  },

  certificationName: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
    },
  },

  organizationText: {
    color: "rgba(0, 187, 212, 1)",
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
    },
  },

  dateText: {
    color: "text.secondary",
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
    },
  },

  actionButtons: {
    display: "flex",
  },

  submitError: {
    mb: 2,
  },

  uploadButton: {
    mt: 2,
  },

  selectedFile: {
    mt: 1,
    color: "rgba(0, 187, 212, 1)",
  },

  saveButton: {
    background: "rgba(0, 187, 212, 1)",

    "&:hover": {
      background: "rgba(0, 160, 180, 1)",
    },
  },

  dialogCloseButton: {
    position: "absolute",
    right: 8,
    top: 8,
  },
  dialogPaper: {
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0px 12px 40px rgba(0,0,0,0.15)",
},

dialogHeader: {
  background:
    "linear-gradient(135deg,#00BBD4,#0097A7)",
  color: "#fff",
  fontWeight: 600,
},

uploadArea: {
  border: "2px dashed #00BBD4",
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center",
  cursor: "pointer",
  background: "#F8FDFF",
  transition: "0.3s",

  "&:hover": {
    background: "#EEF9FB",
  },
},

footerButton: {
  borderRadius: "10px",
  px: 4,
},

gradientSaveButton: {
  background:
    "linear-gradient(135deg,#00BBD4,#0097A7)",
  borderRadius: "10px",

  "&:hover": {
    background:
      "linear-gradient(135deg,#00ACC1,#00838F)",
  },
},
});