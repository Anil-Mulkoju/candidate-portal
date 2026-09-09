// ResumeLoader.jsx

import React from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.95; }
  100% { transform: scale(1); opacity: 1; }
`;

const scan = keyframes`
  0% { top: 0%; opacity: 0.8; }
  50% { opacity: 1; }
  100% { top: 100%; opacity: 0.8; }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const dots = keyframes`
  0%, 20% { opacity: 0; }
  40% { opacity: 1; }
  60% { opacity: 0; }
  80%, 100% { opacity: 1; }
`;

const ResumeLoader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        background:
          "radial-gradient(circle, rgba(0,187,212,0.1) 0%, #f9fafb 70%)",
      }}
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          width: 200,
          height: 250,
          borderRadius: 4,
          background:
            "linear-gradient(145deg, #ffffff 0%, rgba(0,187,212,0.1) 100%)",
          boxShadow: "0 12px 35px rgba(0,187,212,0.2)",
          position: "relative",
          overflow: "hidden",
          animation: `${pulse} 3s infinite ease-in-out`,
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            borderStyle: "solid",
            borderWidth: "0 40px 40px 0",
            borderColor:
              "rgba(0,187,212,0.2) transparent transparent rgba(0,187,212,0.2)",
          },
        }}
        component={motion.div}
        animate={{ rotate: [0, 1, -1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: `${60 + (i % 3) * 20}%`,
              height: 14,
              borderRadius: 2,
              mt: i === 0 ? 3 : 2.5,
              mx: "auto",
              background:
                "linear-gradient(90deg, rgba(0,187,212,0.2) 25%, rgba(0,187,212,0.1) 50%, rgba(0,187,212,0.2) 75%)",
              backgroundSize: "400px 100%",
              animation: `${shimmer} 2s infinite`,
            }}
          />
        ))}

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 32,
            bgcolor: "rgba(0,187,212,0.3)",
            animation: `${scan} 2.8s linear infinite`,
          }}
        />
      </Box>

      <Typography
        variant="h5"
        sx={{
          mt: 5,
          fontWeight: 700,
          color: "#00BBD4",
          textAlign: "center",
        }}
      >
        Processing Resume
        <Box
          component="span"
          sx={{
            animation: `${dots} 1.5s steps(4, end) infinite`,
          }}
        >
          ...
        </Box>
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mt: 1.5,
          color: "#00BBD4",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        Extracting Structured Data
      </Typography>
    </Box>
  );
};

export default ResumeLoader;