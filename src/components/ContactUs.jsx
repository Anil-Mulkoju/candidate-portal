import React, { useState, useRef, useContext, useEffect } from "react";
import {
  Avatar,
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ResumeHeadline from "./ProfilePageComponent/ResumeHeadline";
import KeySkills from "./ProfilePageComponent/KeySkills";
import PersonalDetailsPage from "./ProfilePageComponent/PersonalDetails";
import EducationPage from "./ProfilePageComponent/Education";
import ProjectDialog from "./ProfilePageComponent/ProjectsComponent";
import ProfileSection from "./ProfilePageComponent/ProfileSummaryPage";
import CareerProfileSection from "./ProfilePageComponent/CareerProfile";
import CertificationsSection from "./ProfilePageComponent/Certifications";
import { AppContext } from "../AppContext";
import EmploymentForm from "./ProfilePageComponent/Employement";
import { ACCESS_TOKEN, getItem, IS_AUTHENTICATED, setItem, USER_TYPE } from "./Utils/helper";

const sections = [
  { label: "Basic Information", completed: true },
  { label: "Skills", completed: true },
  { label: "Experience", completed: true },
  { label: "Education", completed: false },
  { label: "Projects", completed: false },
  { label: "Certifications", completed: false },
];

const ProfilePage = () => {
  const { formData = {}, setFormData } = useContext(AppContext);
  const [resumeHeadline, setResumeHeadline] = useState("");
  const [activeSection, setActiveSection] = useState("Basic Information");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const profile = {
    name: formData.candidateData?.data?.full_name || "Rahul Raj",
    location: formData.candidateData?.data?.employment?.[0]?.location || "Hyderabad, India",
    country: formData.candidateData?.data?.employment?.[0]?.country || "",
    phone: formData.candidateData?.data?.phone_no || "8976477883",
    email: formData.candidateData?.data?.email || "rahulraj@gmail.com",
    availability: formData.candidateData?.data?.employment?.[0]?.notice_period_days || "",
    profileImage: formData.candidateData?.data?.profile_picture || "https://via.placeholder.com/150",
    jobTitle: formData.candidateData?.data?.employment?.[0]?.job_title || "Statistical Programmer",
    company: formData.candidateData?.data?.employment?.[0]?.company_name || "TechCorp Solutions",
    about:
      formData.candidateData?.data?.profile_summary ||
      "Detail-oriented Statistical Programmer with 3+ years of experience in clinical trials and pharmaceutical research. Proficient in SAS programming, data analysis, and CDISC standards (SDTM, ADaM). Skilled in generating datasets, tables, listings, and figures (TLFs) to support regulatory submissions. Adept at collaborating with cross-functional teams in fast-paced environments.",
  };

  const sectionRefs = {
    "Basic Information": useRef(null),
    Skills: useRef(null),
    Experience: useRef(null),
    Education: useRef(null),
    Projects: useRef(null),
    Certifications: useRef(null),
  };

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     setFetchError(null);
  //     try {
  //       const token = getItem(ACCESS_TOKEN);
  //       if (!token) {
  //         throw new Error("No authentication token found. Please log in.");
  //       }

  //       const candidateData = await fetchCandidateCompleteDetails(setFetchLoading);
  //       console.log("Candidate Data:", candidateData);

  //       if (candidateData) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           candidateData: {
  //             ...candidateData,
  //             profile_picture: candidateData.profile_picture || "https://via.placeholder.com/150",
  //           },
  //         }));

  //         setItem(IS_AUTHENTICATED, true);
  //         setItem(USER_TYPE, "candidate");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching candidate details:", error.message);
  //       setFetchError(`Failed to fetch candidate details: ${error.message}`);
  //     }
  //   };

  //   fetchDetails();
  // }, [setFormData]);

  // const handleRetryFetch = () => {
  //   const fetchDetails = async () => {
  //     setFetchError(null);
  //     try {
  //       const token = getItem(ACCESS_TOKEN);
  //       if (!token) {
  //         throw new Error("No authentication token found. Please log in.");
  //       }

  //       const candidateData = await fetchCandidateCompleteDetails(setFetchLoading);
  //       console.log("Candidate Data:", candidateData);

  //       if (candidateData) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           candidateData: {
  //             ...candidateData,
  //             profile_picture: candidateData.profile_picture || "https://via.placeholder.com/150",
  //           },
  //         }));

  //         setItem(IS_AUTHENTICATED, true);
  //         setItem(USER_TYPE, "candidate");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching candidate details:", error.message);
  //       setFetchError(`Failed to fetch candidate details: ${error.message}`);
  //     }
  //   };

  //   fetchDetails();
  // };

  if (fetchLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress sx={{ color: "#007bff" }} />
      </Box>
    );
  }

  // if (fetchError) {
  //   return (
  //     <Box sx={{ my: 4, textAlign: "center" }}>
  //       <Typography color="error" variant="body1">
  //         {fetchError}
  //       </Typography>
  //       <Button
  //         startIcon={<RefreshIcon/>}
  //         // onClick={handleRetryFetch}
  //         variant="contained"
  //         sx={{ mt: 2, bgcolor: "#007bff", "&:hover": { bgcolor: "#0056b3" } }}
  //       >
  //         Retry
  //       </Button>
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ maxHeight: "90vh", bgcolor: "#f5f5f5", overflowY: "auto" }}>
      <Box sx={{ p: 3, flex: 1 }}>
        <Grid container spacing={2}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                bgcolor: "#fff",
                borderRadius: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                height: "fit-content",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "#1a237e" }}>
                Profile Completion
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>65%</Typography>
                <LinearProgress
                  variant="determinate"
                  value={65}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": { bgcolor: "#6b48ff" },
                  }}
                />
              </Box>
              <List>
                {sections.map((section, idx) => (
                  <ListItem
                    key={idx}
                    disableGutters
                    onClick={() => setActiveSection(section.label)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                      py: 0.5,
                    }}
                  >
                    {section.completed ? (
                      <CheckCircleIcon
                        color="success"
                        fontSize="small"
                        sx={{ mr: 1 }}
                      />
                    ) : (
                      <RadioButtonUncheckedIcon
                        color="disabled"
                        fontSize="small"
                        sx={{ mr: 1 }}
                      />
                    )}
                    <ListItemText
                      primary={section.label}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper
              sx={{
                p: 3,
                bgcolor: "#fff",
                borderRadius: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              ref={sectionRefs["Information"]}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={profile.profileImage}
                  alt="User Profile"
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a237e" }}>
                    {profile.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#546e7a", fontStyle: "italic" }}
                  >
                    {profile.jobTitle} | {profile.company} | {profile.location}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    <EmailOutlinedIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                    {profile.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <PhoneOutlinedIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                    {profile.phone}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#1a237e" }}>
                About
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                {profile.about}
              </Typography>
            </Paper>

            {/* Additional Sections */}
            <Grid size={{ xs: 12, md: 12 }} ref={sectionRefs["Skills"]}>
              <Paper sx={{ p: 3, bgcolor: "#fff", borderRadius: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)", mt: 2 }}>
                <KeySkills candidateData={formData.candidateData?.data || {}} />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }} ref={sectionRefs["Experience"]}>
              <Paper sx={{ p: 3, bgcolor: "#fff", borderRadius: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)", mt: 2 }}>
                <EmploymentForm candidateData={formData.candidateData?.data || {}} />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }} ref={sectionRefs["Education"]}>
              <Paper sx={{ p: 3, bgcolor: "#fff", borderRadius: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)", mt: 2 }}>
                <EducationPage candidateData={formData.candidateData?.data || {}} />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }} ref={sectionRefs["Projects"]}>
              <Paper sx={{ p: 3, bgcolor: "#fff", borderRadius: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)", mt: 2 }}>
                <ProjectDialog candidateData={formData.candidateData?.data || {}} />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }} ref={sectionRefs["Certifications"]}>
              <Paper sx={{ p: 3, bgcolor: "#fff", borderRadius: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)", mt: 2 }}>
                <CertificationsSection candidateData={formData.candidateData?.data || {}} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfilePage;