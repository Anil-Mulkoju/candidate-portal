import React, { useContext, useState } from "react";
import { Box, Typography, Card, Button } from "@mui/material";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../../styles/theme";
import { AppContext } from "../../AppContext";
import { fetchCandidateCountByStatus } from "../../actions/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(AppContext);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [candidatesData, setCandidatesData] = useState([]);
  const [selectedRequisition, setSelectedRequisition] = useState({ active: false, closed: false });

  const handleActiveRequisitions = () => {
    setSelectedRequisition((prev) => ({
      active: !prev.active,
      closed: prev.closed ? false : prev.closed,
    }));
    setSelectedStatus("shortlisted");
    navigate("jobs");
  };

  const handleNewRequisition = () => {
    navigate("job-requirements");
  };

  const handleClosedRequisitions = () => {
    setSelectedRequisition((prev) => ({
      active: prev.active ? false : prev.active,
      closed: !prev.closed,
    }));
    setSelectedStatus("declined");
    fetchCandidateCountByStatus("Declined", setCandidatesData, setLoading);
  };

  const cardStyles = {
    borderRadius: "24px",
    width: { xs: "100%", sm: "90%", md: "80%" },
    maxWidth: "400px",
    p: { xs: 2, sm: 3, md: 4 },
    minHeight: { xs: "160px", sm: "180px", md: "200px" },
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0px 4px 20px rgba(0, 0, 0, 0.1)`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.15), 0 0 15px ${theme.palette.primary.main}`,
    },
  };

  const newRequisitionCardStyles = {
    ...cardStyles,
    backgroundColor: "rgb(17, 2, 82)",
    "& .MuiTypography-root": {
      color: "white",
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
        backgroundImage: `linear-gradient(to bottom right, rgba(3,3,90,0.6), rgba(4,155,172,0.6)), url("./images/foremployerbackground.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // background: `linear-gradient(310deg, ${theme.palette.primary.main}, rgb(218, 220, 236))`,
        borderRadius: "20px",
        position: "relative",
        minHeight: { xs: "80vh", sm: "85vh", md: "90vh" },
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 4 }}
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", mt: { xs: 2, sm: 3, md: 4 }, ml: { md: 5 } }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={cardStyles}>
            <Typography
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                fontWeight: 600,
                textAlign: "center",
                mb: 2,
              }}
              variant="h6"
            >
              Active Requisitions
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "rgb(17, 2, 82)",
                borderRadius: "16px",
                textTransform: "none",
                fontWeight: 500,
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                "&:hover": {
                  backgroundColor: theme.palette.success.light,
                },
              }}
              onClick={handleActiveRequisitions}
            >
              View Active Jobs
            </Button>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={newRequisitionCardStyles}>
            <Typography
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                fontWeight: 600,
                textAlign: "center",
                mb: 2,
              }}
              variant="h6"
            >
              Open a New Requisition
            </Typography>
            <Button
              variant="contained"
              sx={{
                borderRadius: "16px",
                textTransform: "none",
                backgroundColor: "green",
                fontWeight: 500,
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                "&:hover": {
                  backgroundColor: theme.palette.success.light,
                },
              }}
              onClick={handleNewRequisition}
            >
              Create New
            </Button>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={cardStyles}>
            <Typography
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                fontWeight: 600,
                textAlign: "center",
                mb: 2,
              }}
              variant="h6"
            >
              Closed Requisitions
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "16px",
                textTransform: "none",
                fontWeight: 500,
                px: { xs: 2, sm: 3 },
                backgroundColor: "rgb(17, 2, 82)",
                py: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                "&:hover": {
                  backgroundColor: theme.palette.success.light,
                },
              }}
              onClick={handleClosedRequisitions}
            >
              View Closed Jobs
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;