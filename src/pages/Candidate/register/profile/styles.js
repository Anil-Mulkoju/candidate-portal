export const getStyles = (theme) => ({
  container: {
    mt: { xs: 0, lg: 9, xl: 18 },
  },

  formWrapper: {
    mt: 1,
    p: 4,
    bgcolor: "#fff",
    borderRadius: 2,
    boxShadow: 3,
  },

  pageTitle: {
    mb: 4,
  },

inputField: {
  "& .MuiInputBase-root": {
    background: "transparent",
  },

  "& .MuiInput-underline:before": {
    borderBottom: "1px solid #BDBDBD",
  },

  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottom: `2px solid ${theme.colors.cyan[200]}`,
  },

  "& .MuiInput-underline:after": {
    borderBottom: `2px solid ${theme.colors.cyan[200]}`,
  },

  "& .MuiInputLabel-root": {
    color: "#757575",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.colors.cyan[200],
  },
},
domainSelect: {
  "&:before": {
    borderBottom: "1px solid #BDBDBD",
  },

  "&:hover:not(.Mui-disabled):before": {
    borderBottom: `2px solid ${theme.colors.cyan[200]}`,
  },

  "&:after": {
    borderBottom: `2px solid ${theme.colors.cyan[200]}`,
  },
},

  uploadButton: {
    mt: 2,
    background: theme.colors.cyan[200],

    "&:hover": {
      background: theme.colors.cyan[300],
    },
  },

  submitButton: {
    mt: 3,
    background: theme.colors.cyan[200],

    "&:hover": {
      background: theme.colors.cyan[300],
    },
  },

  uploadedFileBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    p: 1,
    mt: 2,
    border: "1px solid #ccc",
    borderRadius: 1,
  },

  autocompleteBox: {
    mt: 2,
  },
});