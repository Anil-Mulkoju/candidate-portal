import React, { useCallback, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import {
  useAddCandidateEducationMutation,
  useDeleteCandidateEducationMutation,
  useGetCandidateEducationQuery,
  useUpdateCandidateEducationMutation,
} from "../../../../store/api/settings/CandidatePortalApis";
import { palette, fonts } from "../../../../theme/candidateTokens";
 
const dialogFieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: palette.line },
    "&:hover fieldset": { borderColor: palette.teal },
    "&.Mui-focused fieldset": { borderColor: palette.teal },
  },
};
 
const EducationPage = ({
  educationSelectionInfo,
  handleNext = () => {},
  onEducationChange,
  completeDetailsApi,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [educationHistory, setEducationHistory] = useState([]);
  const [educationLevel, setEducationLevel] = useState("");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [courseType, setCourseType] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [gradingSystem, setGradingSystem] = useState("");
  const [marks, setMarks] = useState("");
  const [error, setError] = useState("");
  const [addCandidateEducation] = useAddCandidateEducationMutation();
  const [updateCandidateEducation] = useUpdateCandidateEducationMutation();
  const [deleteCandidateEducation] = useDeleteCandidateEducationMutation();
 
  // Auto-fetches on mount (unless educationSelectionInfo was already passed
  // in) and, because getCandidateEducation provides the "CandidateEducation"
  // tag and add/update/delete all invalidate it (see CandidatePortalApis.js),
  // this automatically refetches after every save or delete — no manual
  // trigger calls needed.
  const { data: candidateEducationData } = useGetCandidateEducationQuery(
    undefined,
    { skip: !!educationSelectionInfo },
  );
 
  const educationOptions = [
    "Doctorate/PhD",
    "Masters/Post-Graduation",
    "Graduation/Diploma",
    "12th",
    "10th",
    "Below 10th",
  ];
  const yearOptions = Array.from({ length: 50 }, (_, i) =>
    (2025 - i).toString(),
  );
  const endYearOptions = startYear
    ? yearOptions.filter((y) => parseInt(y) >= parseInt(startYear))
    : yearOptions;
 
  const gradingSystemOptions = [
    "Percentage",
    "CGPA Scale of 10",
    "CGPA Scale of 4",
    "GPA",
  ];
 
  //=========================== Map backend education_level to frontend options =======================//
  const educationLevelMap = {
    "Post Graduation": "Masters/Post-Graduation",
    Graduation: "Graduation/Diploma",
    Diploma: "Graduation/Diploma",
  };
 
  //============================== Reverse map for sending to backend======================//
  const reverseEducationLevelMap = Object.fromEntries(
    Object.entries(educationLevelMap).map(([k, v]) => [v, k]),
  );
 
  //=========================== Load initial education history from educationSelectionInfo======================//
  useEffect(() => {
    const educationData = Array.isArray(educationSelectionInfo?.education)
      ? educationSelectionInfo.education.map((edu) => ({
          ...edu,
          education_level:
            educationLevelMap[edu.education_level] || edu.education_level || "",
        }))
      : [];
    setEducationHistory(educationData);
    if (onEducationChange) onEducationChange(educationData);
  }, [educationSelectionInfo, onEducationChange]);
 
  useEffect(() => {
    if (educationSelectionInfo) return;
 
    // GET /candidates/get-education returns
    const sourceEducation = Array.isArray(candidateEducationData?.data)
      ? candidateEducationData.data
      : Array.isArray(candidateEducationData)
        ? candidateEducationData
        : [];
 
    const educationData = sourceEducation.map((edu) => ({
      ...edu,
      education_level:
        educationLevelMap[edu.education_level] || edu.education_level || "",
    }));
    setEducationHistory(educationData);
    if (onEducationChange) onEducationChange(educationData);
  }, [educationSelectionInfo, candidateEducationData, onEducationChange]);
 
  // Populate form fields when opening dialog
  useEffect(() => {
    if (!openDialog) return;
 
    let educationData = {
      id: crypto.randomUUID(),
      education_level: "",
      university: "",
      course: "",
      specialization: "",
      course_type: "",
      start_year: "",
      end_year: "",
      grading_system: "",
      marks: "",
    };
 
    if (editingIndex !== null && educationHistory[editingIndex]) {
      educationData = educationHistory[editingIndex];
    }
 
    setEducationLevel(educationData.education_level || "");
    setUniversity(educationData.university || "");
    setCourse(educationData.course || "");
    setSpecialization(educationData.specialization || "");
    setCourseType(educationData.course_type || "");
    setStartYear(educationData.start_year?.toString() || "");
    setEndYear(educationData.end_year?.toString() || "");
    setGradingSystem(educationData.grading_system || "");
    setMarks(educationData.marks?.toString() || "");
  }, [openDialog, editingIndex, educationHistory]);
 
  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!educationLevel) errors.educationLevel = "Education level is required";
    if (!university) errors.university = "University is required";
    if (!course) errors.course = "Course is required";
    if (!startYear) errors.startYear = "Start year is required";
    if (!endYear) errors.endYear = "End year is required";
    if (marks && isNaN(parseFloat(marks))) {
      errors.marks = "Marks must be a valid number";
    } else if (marks) {
      const marksValue = parseFloat(marks);
      if (gradingSystem === "Percentage" && marksValue > 100) {
        errors.marks = "Percentage cannot exceed 100";
      } else if (gradingSystem === "CGPA Scale of 10" && marksValue > 10) {
        errors.marks = "CGPA cannot exceed 10";
      } else if (gradingSystem === "CGPA Scale of 4" && marksValue > 4) {
        errors.marks = "CGPA cannot exceed 4";
      }
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  };
 
  const handleSaveEducation = async () => {
    const { isValid, errors } = validateForm();
    if (!isValid) {
      setError(Object.values(errors).join(", "));
      return;
    }
 
    const educationPayload = {
      education_level:
        reverseEducationLevelMap[educationLevel] || educationLevel,
      university,
      course,
      specialization: specialization || null,
      course_type: courseType || null,
      start_year: parseInt(startYear),
      end_year: parseInt(endYear),
      grading_system: gradingSystem || null,
      marks: marks ? parseFloat(marks) : null,
    };
 
    try {
      if (editingIndex !== null) {
        const eduId = educationHistory[editingIndex].id;
        await updateCandidateEducation({
          id: eduId,
          body: educationPayload,
        }).unwrap();
      } else {
        await addCandidateEducation(educationPayload).unwrap();
      }
 
      setError("");
      setEditingIndex(null);
      setOpenDialog(false);
      handleNext();
    } catch (err) {
      setError(
        err?.data?.message || err?.message || "Error saving education record.",
      );
      console.error("Save Error:", err);
    }
  };
 
  const handleDelete = useCallback(
    async (edu) => {
      try {
        await deleteCandidateEducation(edu?.id).unwrap();
        setEducationHistory((prev) => prev.filter((e) => e.id !== edu.id));
        await completeDetailsApi();
      } catch (err) {
        setError(
          err?.data?.message ||
            err?.message ||
            "Failed to delete education record.",
        );
        console.error("Delete Error:", err);
      }
    },
    [completeDetailsApi],
  );
 
  const handleEdit = (index) => {
    setEditingIndex(index);
    setOpenDialog(true);
  };
 
  const handleCancel = () => {
    setEditingIndex(null);
    setOpenDialog(false);
    setError("");
  };
 
  const renderEducationEntry = (edu, index) => (
    <Box
      key={edu.id || index}
      sx={{
        mt: 2,
        p: 2.25,
        position: "relative",
        border: `1px solid ${palette.line}`,
        borderRadius: "10px",
        "&:hover": { borderColor: palette.teal },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 0.5,
        }}
      >
        <IconButton
          size="small"
          sx={{ color: palette.teal }}
          onClick={() => handleEdit(index)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: palette.coral }}
          onClick={() => handleDelete(edu)}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography
        sx={{
          fontSize: { xs: 13, sm: 15 },
          fontWeight: 600,
          color: palette.ink,
        }}
      >
        {edu.education_level || edu.course || "Education"}
      </Typography>
      <Typography
        sx={{
          color: palette.teal,
          fontSize: { xs: 12.5, sm: 14 },
          fontWeight: 500,
        }}
      >
        {edu.university || "N/A"}
      </Typography>
      <Typography sx={{ color: palette.muted, fontSize: { xs: 12, sm: 13.5 } }}>
        {edu.course || "N/A"} {edu.specialization && `in ${edu.specialization}`}
      </Typography>
      <Typography
        sx={{
          color: palette.muted,
          fontFamily: fonts.mono,
          fontSize: { xs: 11.5, sm: 13 },
        }}
      >
        {edu.start_year} - {edu.end_year || "N/A"}
      </Typography>
      {edu.course_type && (
        <Typography
          sx={{ color: palette.muted, fontSize: { xs: 12, sm: 13.5 } }}
        >
          Course Type: {edu.course_type}
        </Typography>
      )}
      {edu.marks !== null && (
        <Typography
          sx={{ color: palette.muted, fontSize: { xs: 12, sm: 13.5 } }}
        >
          Marks: {edu.marks} ({edu.grading_system})
        </Typography>
      )}
    </Box>
  );
 
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: palette.paper,
        border: `1px solid ${palette.line}`,
        borderRadius: "14px",
        p: { xs: 2.5, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "9px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: palette.tealSoft,
              color: palette.teal,
            }}
          >
            <SchoolOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 17,
              color: palette.ink,
            }}
          >
            Education
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: palette.teal,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: palette.tealDeep },
          }}
          onClick={() => setOpenDialog(true)}
        >
          + Add Education
        </Button>
      </Box>
 
      {error && !openDialog && (
        <Typography sx={{ color: palette.coral, fontSize: 13, mt: 1.5 }}>
          {error}
        </Typography>
      )}
 
      {educationHistory.length > 0 ? (
        educationHistory.map((edu, index) => renderEducationEntry(edu, index))
      ) : (
        <Typography sx={{ color: palette.muted, fontSize: 13.5, mt: 2 }}>
          No education details available.
        </Typography>
      )}
 
      <Dialog
        open={openDialog}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px" } }}
      >
        <DialogTitle
          sx={{
            fontFamily: fonts.display,
            fontWeight: 600,
            color: palette.ink,
          }}
        >
          {editingIndex !== null ? "Edit Education" : "Add Education"}
          <IconButton
            onClick={handleCancel}
            sx={{
              position: "absolute",
              right: 20,
              top: 20,
              color: palette.muted,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Typography sx={{ color: palette.coral, mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              options={educationOptions}
              value={educationLevel}
              onChange={(e, newValue) => setEducationLevel(newValue || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Education Level"
                  sx={dialogFieldSx}
                  error={!!error.includes("Education")}
                  helperText={error.includes("Education") ? error : ""}
                />
              )}
            />
            <TextField
              fullWidth
              label="University/Institute"
              size="small"
              sx={{ mt: 2, ...dialogFieldSx }}
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              error={!!error.includes("University")}
              helperText={error.includes("University") ? error : ""}
            />
            <TextField
              fullWidth
              label="Course"
              size="small"
              sx={{ mt: 2, ...dialogFieldSx }}
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              error={!!error.includes("Course")}
              helperText={error.includes("Course") ? error : ""}
            />
            <TextField
              fullWidth
              label="Specialization"
              size="small"
              sx={{ mt: 2, ...dialogFieldSx }}
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
            <TextField
              fullWidth
              label="Course Type (e.g., Full Time, Part Time)"
              size="small"
              sx={{ mt: 2, ...dialogFieldSx }}
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
            />
            <Grid container spacing={2} sx={{ mt:2 }}>
              <Grid item size={{ xs: 12, sm: 6, lg: 6, xl: 6 }}>
                <Autocomplete
                  options={yearOptions}
                  value={startYear}
                  onChange={(e, newValue) => {
                    setStartYear(newValue || "");
                    // if the current end year is now before the new start year, reset it
                    if (
                      newValue &&
                      endYear &&
                      parseInt(endYear) < parseInt(newValue)
                    ) {
                      setEndYear("");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      label="Start Year"
                      sx={dialogFieldSx}
                      error={!!error.includes("Start")}
                      helperText={error.includes("Start") ? error : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 6, xl: 6 }}>
                <Autocomplete
                  options={endYearOptions}
                  value={endYear}
                  onChange={(e, newValue) => setEndYear(newValue || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      label="End Year"
                      sx={dialogFieldSx}
                      error={!!error.includes("End")}
                      helperText={error.includes("End") ? error : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Autocomplete
              options={gradingSystemOptions}
              value={gradingSystem}
              onChange={(e, newValue) => {
                setGradingSystem(newValue || "");
                setMarks("");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Grading System"
                  sx={{ mt: 2, ...dialogFieldSx }}
                />
              )}
            />
            {gradingSystem && (
              <TextField
                fullWidth
                label={
                  gradingSystem === "Percentage"
                    ? "Percentage out of 100"
                    : gradingSystem === "CGPA Scale of 10"
                      ? "CGPA out of 10"
                      : gradingSystem === "CGPA Scale of 4"
                        ? "CGPA out of 4"
                        : "Marks"
                }
                size="small"
                sx={{ mt: 2, ...dialogFieldSx }}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                error={!!error.includes("Marks")}
                helperText={
                  error.includes("Marks")
                    ? error
                    : gradingSystem === "Percentage"
                      ? "Enter percentage (e.g., 85.5)"
                      : gradingSystem === "CGPA Scale of 10"
                        ? "Enter CGPA (e.g., 8.5)"
                        : gradingSystem === "CGPA Scale of 4"
                          ? "Enter CGPA (e.g., 3.5)"
                          : "Enter marks"
                }
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{
              borderColor: palette.line,
              color: palette.ink,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEducation}
            variant="contained"
            sx={{
              bgcolor: palette.teal,
              textTransform: "none",
              "&:hover": { bgcolor: palette.tealDeep },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
 
export default React.memo(EducationPage);
 
 