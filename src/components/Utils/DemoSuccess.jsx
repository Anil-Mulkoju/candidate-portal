import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation, useNavigate } from "react-router-dom";
import { keyframes } from "@mui/system";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.successMessage || "Success!";
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(135deg, #4caf50, #81c784)",
        animation: `${fadeIn} 1s ease-out`,
        textAlign: "center",
        padding: "20px",
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 80, color: "#ffffff", mb: 2 }} />
      <Typography
        variant="h3"
        color="white"
        sx={{ fontWeight: "bold", marginBottom: 3 }}
      >
        {successMessage}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#388e3c", 
          "&:hover": {
            backgroundColor: "#2c6e34",
          },
        }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}

export default Success;
