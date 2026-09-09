import { makeStyles } from "@mui/styles";

const useDashboardStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    maxWidth: 1400,
    margin: "0 auto",
  },
  topSection: {
  },
  // card: {
  //   background: `linear-gradient(135deg, ${theme.colors.grey[100]}, ${theme.colors.grey[200]})`, // Subtle gradient
  //   textAlign: "center",
  //   width: "100%", 
  //   minHeight: 180, 
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   fontSize: "1.6rem",
  //   fontWeight: 700,
  //   borderRadius: "20px", 
  //   boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.15), 0px 2px 8px rgba(0, 0, 0, 0.1)`,
  //   transition: "transform 0.3s ease, box-shadow 0.3s ease",
  //   "&:hover": {
  //     transform: "translateY(-6px)",
  //     boxShadow: `0px 12px 32px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.15)`,
  //   },
  // },
  cardNewRequisition: {
    background: `linear-gradient(135deg, rgb(8, 27, 82), rgb(12, 40, 120)) !important`,
    textAlign: "center",
    padding: theme.spacing(4),
    width: "100%",
    minHeight: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    fontWeight: 700,
    borderRadius: "20px",
    color: "white",
    // boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.15), 0px 2px 8px rgba(0, 0, 0, 0.1)`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-6px)",
      // boxShadow: `0px 12px 32px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.15)`,
    },
  },
}));

export default useDashboardStyles;