import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fbfd",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h4" fontWeight={600} gutterBottom>
        🚫 Access Denied
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        You are not authorized to access this page.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/for-candidate/login")}
      >
        Go to Candidate Login
      </Button>
    </Box>
  );
}
