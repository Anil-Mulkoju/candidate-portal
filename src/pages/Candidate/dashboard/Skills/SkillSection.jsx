import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Chip,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { GridCloseIcon } from "@mui/x-data-grid";
import { AppContext } from "../../../../AppContext";
import candidateApi from "../../../../services/candidateApi";
import {
  useGetCandidateKeySkillsQuery,
} from "../../../../store/api/settings/CandidatePortalApis";

const ACCENT = "#2B6F71";
const ACCENT_HOVER = "#1F5557";

function SkillsSection({ keySkillInfo, completeDetailsApi }) {
  const { formData = {}, setFormData } = useContext(AppContext);
  const [skills, setSkills] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const availableSkills = [
    "SDTM",
    "ADaM",
    "SUBMISSIONS",
    "TLF",
    "SAS",
    "R",
    "Phase1",
    "Phase II - IV",
    "SDTM Specifications",
    "Mapping/conversion",
    "aCRF",
    "Complex SDTM domains",
    "ADaM Specifications",
    "ADEFF",
    "TP experience",
    "CTT meetings",
    "Randomization checks",
    "SDRG",
    "ADRG",
    "Project level",
    "Pooling SCS",
    "Pooling SCE",
    "Define.xml",
    "DSUR",
    "PSUR",
    "DSMB",
    "DMC",
    "RMP",
    "Safety",
    "Efficacy",
    "Figures",
  ];

  const {
    data: keySkillsResponse,
    isLoading,
    refetch,
  } = useGetCandidateKeySkillsQuery();
  const skillId = keySkillsResponse?.data?.candidate_id;

  // Initialize skills from keySkillInfo or formData.itSkills
  useEffect(() => {
    if (!keySkillsResponse?.data) return;

    const initialSkills =
      keySkillsResponse.data.key_skills
        ?.split(",")
        .map((skill) => skill.trim()) || [];

    setSkills(initialSkills);

    setFormData((prev) => ({
      ...prev,
      itSkills: initialSkills,
    }));
  }, [keySkillsResponse, setFormData]);

  const handleAddClick = () => {
    setCurrentSkill("");
    setEditIndex(null);
    setSuggestions(availableSkills);
    setOpenDialog(true);
    setError(null);
  };

  const handleEditClick = (index) => {
    setCurrentSkill(skills[index]);
    setEditIndex(index);
    setSuggestions(availableSkills);
    setOpenDialog(true);
    setError(null);
  };

  const handleDeleteClick = async (index) => {
    const skillToDelete = skills[index];
    try {
      const response = await candidateApi.delete(
        `/candidates/delete-skill/${skillId}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: new URLSearchParams({
            skill_to_delete: skillToDelete,
          }),
        }
      );

      if (response.status === 200) {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
        setFormData((prev) => ({ ...prev, itSkills: updatedSkills }));
        refetch();
      }
    } catch (err) {
      setError("Failed to delete skill. Please try again.");
      console.error("Delete skill error:", err);
    }
  };

  const handleSave = async () => {
    if (currentSkill.trim() === "") return;

    let updatedSkills = [...skills];
    if (editIndex !== null) {
      updatedSkills[editIndex] = currentSkill.trim();
    } else {
      const newSkills = currentSkill
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill && !updatedSkills.includes(skill));
      updatedSkills = [...updatedSkills, ...newSkills];
    }

    const skillsString = updatedSkills.join(", ");
    try {
      const response = await candidateApi.put(
        `/candidates/update-skill-info/${skillId}`,
        {
          summary: keySkillInfo?.skill_info[0]?.summary || "",
          availability: keySkillInfo?.skill_info[0]?.availability || 0,
          ta_experience_combined:
            keySkillInfo?.skill_info[0]?.ta_experience_combined || "",
          key_skills: skillsString,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSkills(updatedSkills);
        setFormData((prev) => ({ ...prev, itSkills: updatedSkills }));
        setOpenDialog(false);
        setCurrentSkill("");
        setEditIndex(null);
        setSuggestions([]);
        setError(null);
        completeDetailsApi();
      }
    } catch (err) {
      setError("Failed to save skills. Please try again.");
      console.error("Save skill error:", err);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setCurrentSkill(input);

    const lastSkill = input.split(",").pop().trim();
    if (lastSkill === "") {
      setSuggestions(availableSkills);
    } else {
      const filteredSuggestions = availableSkills.filter((skill) =>
        skill.toLowerCase().includes(lastSkill.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (editIndex !== null) {
      setCurrentSkill(suggestion);
    } else {
      const skillsArray = currentSkill.split(",").map((skill) => skill.trim());
      skillsArray[skillsArray.length - 1] = suggestion;
      setCurrentSkill(skillsArray.join(", ") + ", ");
    }
    setSuggestions([]);
  };

  return (
    <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: 2, mb: 2, boxShadow: 1 }}>
      <Box display="flex" alignItems="center" gap={0.5}>
        <Typography variant="subtitle1" fontWeight={600}>
          Key Skills
        </Typography>
        <IconButton
          size="small"
          onClick={handleAddClick}
          sx={{
            bgcolor: ACCENT,
            color: "#fff",
            borderRadius: "6px",
            width: 26,
            height: 26,
            "&:hover": { bgcolor: ACCENT_HOVER },
          }}
        >
          <EditIcon sx={{ fontSize: "15px" }} />
        </IconButton>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Box mt={{ xs: 1, sm: 1.5, md: 2 }} display="flex" gap={1} flexWrap="wrap">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <Chip
              key={index}
              onClick={() => handleEditClick(index)}
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontSize: { xs: 10, sm: 12, md: 14 }, ml: 0.2 }}
                  >
                    {skill}
                  </Typography>

                  <DeleteOutlineIcon
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent edit click
                      handleDeleteClick(index);
                    }}
                    sx={{
                      fontSize: 16,
                      color: "#EF4444",
                      cursor: "pointer",
                      opacity: 0,
                      transform: "scale(0.8)",
                      transition: "all .2s ease",
                      ".MuiChip-root:hover &": {
                        opacity: 1,
                        transform: "scale(1)",
                      },
                      "&:hover": {
                        color: "#DC2626",
                      },
                    }}
                  />
                </Box>
              }
              sx={{
                bgcolor: "#fff",
                border: "1px solid #D1D5DB",
                color: "#374151",
                height: 34,
                "&:hover": {
                  borderColor: ACCENT,
                },
              }}
            />
          ))
        ) : (
          <Typography color="text.secondary">No skills available</Typography>
        )}
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0px 12px 40px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER})`,
            color: "#fff",
            py: 2.5,
            px: 3,
            fontWeight: 600,
            position: "relative",
          }}
        >
          {editIndex !== null ? "Edit Skill" : "Add Skills"}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 12, top: 12, color: "#fff" }}
          >
            <GridCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, paddingTop: 4 }}>
          <TextField
            fullWidth
            label={editIndex !== null ? "Skill" : "Skills (comma-separated)"}
            value={currentSkill}
            onChange={handleInputChange}
            autoFocus
            margin="dense"
            helperText={
              editIndex === null
                ? "Enter multiple skills separated by commas"
                : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fafafa",
              },
              "& .MuiInputLabel-root": {
                backgroundColor: "#fff",
                px: 0.5,
              },
            }}
          />
          {suggestions.length > 0 && (
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                mt: 1,
                bgcolor: "#fff",
              }}
            >
              <List dense>
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      "&:hover": { bgcolor: "#f5f7fa" },
                    }}
                  >
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #f0f0f0" }}>
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(false)}
            sx={{ borderRadius: "10px", px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER})`,
              color: "#fff",
              borderRadius: "10px",
              px: 4,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: `linear-gradient(135deg, ${ACCENT_HOVER}, ${ACCENT_HOVER})`,
              },
            }}
          >
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default React.memo(SkillsSection);