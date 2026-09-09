import React, { memo, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Divider,
  Card,
  useTheme,
  Grid,
  Dialog,
  IconButton,
} from "@mui/material";
import UseJobRequirementsStyles from "./style";
import ExpressRequirements from "../ExpressRequirements";
import axios from "axios";
import _get from "lodash/get";
import { _post } from "../../api";
import { getItem, IS_AUTHENTICATED } from "../Utils/helper";
import { useNavigate } from "react-router-dom";
import {
  getMandatorySkills,
  getPrimarySkills,
  getSecondarySkills,
  uploadFileToGetQuestions,
} from "../../actions/forTalent";
import { AppContext } from "../../AppContext";
import CloseIcon from "@mui/icons-material/Close";
import _isArray from "lodash/isArray";
import _join from "lodash/join";
import _map from "lodash/map";
import Dropdown from "../Common/Dropdown";
// import { questionsList } from "../ExpressRequirements/constants";
const secondarySkillsList = [
  "SDTM Experience",
  "TLFs",
  "oncology",
  "ADaM Experience",
  "Pooling SCS",
  "Pooling SCE",
  "Define.xml",
  "DSUR/PSUR/DSMB/DMC/RMP",
  "Efficacy",
  "Figures",
  "Lead Programmer",
  "Submissions",
];
//const mandatorySkillsList = ["SDTM Experience", "oncology", "TLFs", "ADaM Experience", "Pooling SCS", "Pooling SCE", "Define.xml", "DSUR/PSUR/DSMB/DMC/RMP", "Efficacy", "Figures", "Lead Programmer", "Submissions"]
const availability = [
  { value: "0", label: "Immediately Available" },
  { value: "30", label: "LessThan 30 days" },
  { value: "60", label: "LessThan 60 days" },
  { value: "90", label: "LessThan 90 days" },
];
const positions = [
  { name: "Statistical Programmer" },
  { name: "Clinical Data Manager" },
  { name: "BioStatistician" },
];
const JobRequirements = memo(() => {
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedSkill, setSelectedSkill] = useState({ ...positions[0] });
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const [experience, setExperience] = useState({});
  const [selectedPrimarySkills, setSelectedPrimarySkills] = useState([]);
  const [selectedSecondarySkills, setSelectedSecondarySkills] = useState([]);
  const [selectedMandatoryhSkills, setSelectedMandatorySkills] = useState([]);
  const [secondarySkills, setSecondarySkills] = useState([]);
  const [mandatorySkills, setMandatorySkills] = useState([]);
  const [primarySkills, setPrimarySkills] = useState([]);
  const [mandatoryLoading, setMandatoryLoading] = useState(false);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const [experienceError, setExperienceError] = useState();
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const toggleSkill = (skill) => {
    setSelectedPrimarySkills((prevSelected) =>
      prevSelected.includes(skill)
        ? prevSelected.filter((s) => s !== skill)
        : [...prevSelected, skill]
    );
    setMandatoryLoading(false);
    setSecondaryLoading(false);
  };

  const isSelected = (skill) => selectedPrimarySkills.includes(skill);
  const { setLoading } = useContext(AppContext);
  const classes = UseJobRequirementsStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const isLogin = getItem(IS_AUTHENTICATED);
  const maxLength = 2000;
  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
    getPrimarySkillsData();
  }, []);
  useEffect(() => {
    if (
      _isArray(selectedPrimarySkills) &&
      selectedPrimarySkills.length > 0 &&
      mandatoryLoading
    ) {
      getMandatorySkillsData();
    } else {
      setSelectedMandatorySkills([]);
      setMandatoryLoading(false);
    }
  }, [mandatoryLoading]);
  useEffect(() => {
    if (
      secondaryLoading &&
      ((_isArray(selectedMandatoryhSkills) &&
        selectedMandatoryhSkills.length > 0) ||
        (_isArray(selectedPrimarySkills) && selectedPrimarySkills.length > 0))
    )
      getSecondarySkillsData();
    else {
      setSelectedSecondarySkills([]);
      setSecondaryLoading(false);
    }
  }, [secondaryLoading]);

  const getPrimarySkillsData = () => {
    getPrimarySkills(setLoading, (data) => {
      setPrimarySkills(data || []);
      setSelectedPrimarySkills([]);
    });
  };
  const getMandatorySkillsData = () => {
    const payload = selectedPrimarySkills.join(",");
    getMandatorySkills(payload, (data) => {
      setMandatorySkills(data || []);
      setSelectedMandatorySkills([]);
    });
  };
  const getSecondarySkillsData = () => {
    const primary = selectedPrimarySkills.join(",");
    const mandatory = _join(_map(selectedMandatoryhSkills, "key"), ",");
    getSecondarySkills(primary, mandatory, (secondaryData) => {
      setSecondarySkills(secondaryData || []);
      setSelectedSecondarySkills([]);
    });
  };

  const handlePositionClick = (position) => {
    setSelectedPosition(position);
  };

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
  };

  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validFileTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (validFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setFileError("");
      } else {
        setFileError("Please upload a valid file (PDF, TXT, DOC, DOCX, XLSX).");
        setFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    console.log("selectedSecondarySkills:", selectedSecondarySkills);
    console.log(
      "secondaryskills payload:",
      _map(selectedSecondarySkills, "key")
    );
    const formData = new FormData();
    formData.append("no_of_positions", selectedPosition);
    formData.append("function", selectedSkill && selectedSkill.name);
    formData.append("min_years", experience.min || "");
    formData.append("max_years", experience.max || "");
    formData.append("primaryskills", selectedPrimarySkills.join(","));
    formData.append(
      "secondaryskills",
      _map(selectedSecondarySkills, "key").join(",")
    );
    formData.append(
      "mandatoryskills",
      _map(selectedMandatoryhSkills, "key").join(",")
    );
    formData.append(
      "availability",
      selectedAvailability ? selectedAvailability.value : ""
    );
    if (file) formData.append("file", file);
    else formData.append("text", instructions);
    const response = await uploadFileToGetQuestions(formData, setLoading);
    if (response && response.data) {
      const fetchedQuestions = _get(response, "data");
      setQuestionsData(fetchedQuestions);
      setOpenDialog(true);
    }
  };
  useEffect(() => {
    if (experience.min && experience.max) {
      const min = parseInt(experience.min);
      const max = parseInt(experience.max);
      if (!isNaN(min) && !isNaN(max) && min > max) {
        setExperienceError("Min years cannot be greater than Max years");
      } else {
        setExperienceError("");
      }
    } else {
      setExperienceError("");
    }
  }, [experience]);
  const handleExperience = (e) => {
    setExperience((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isError = instructions.length > maxLength;
  return (
    <Box
      className="container"
      sx={{
        width: { xs: "100%", sm: "90%", lg: "95%", lg: "90%" },
        maxWidth: "1200px",
        mx: "auto",
        px: { xs: 2, sm: 3, lg: 4 },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        className={classes.title}
        sx={{
          textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          color: theme.palette.text.primary,
          fontWeight: 700,
          mb: 3,
          p: 1,
        }}
      >
        Tell us your requirements
      </Typography>

      <Grid container display="flex" direction={"column"} spacing={1}>
        <Grid size={{ xs: 12, sm: 12, lg: 12 }} sx={{ ml: { lg: "20px" } }}>
          <Box className={classes.section}>
            <Typography
              variant="subtitle1"
              gutterBottom
              className={classes.subtitle}
            >
              How many positions would you like to fill?
            </Typography>
            <Box
              sx={{
                display: "flex",
                p: 2,
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              {["One", "Less than 5", "More than 5"].map((text) => (
                <Button
                  key={text}
                  variant="contained"
                  sx={{
                    backgroundColor:
                      selectedPosition === text
                        ? theme.palette.secondary.dark
                        : theme.palette.secondary.light,
                    width: { xs: "100%", sm: "auto" },
                    borderRadius: "20px",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                      color: theme.palette.white,
                    },
                    color:
                      selectedPosition === text
                        ? theme.palette.white
                        : theme.palette.text.main,
                  }}
                  onClick={() => handlePositionClick(text)}
                >
                  {text}
                </Button>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid item>
        <Box
          className={classes.section}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            p: { xs: 2, sm: 3, lg: 2 },
            ml: { lg: "-8px", sm: "-50px" },
          }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            className={classes.subtitle}
          >
            What are the primary skills you want to create?
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            {positions.map((skill, i) => (
              <Button
                key={skill.name}
                variant="contained"
                sx={{
                  backgroundColor:
                    selectedSkill.name === skill.name
                      ? theme.palette.secondary.dark
                      : theme.palette.secondary.light,
                  width: { xs: "100%", sm: "auto" },
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                    color: theme.palette.white,
                  },
                  color:
                    selectedSkill.name === skill.name
                      ? theme.palette.white
                      : theme.palette.text.main,
                }}
                onClick={() => handleSkillClick(skill)}
                disabled={i !== 0}
              >
                {skill.name}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              width: "100%",
              mt: 4,
              p: { xs: 2, sm: 3 },
              borderRadius: "4px",
              boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.15), 0px 2px 8px rgba(0, 0, 0, 0.1)`,
            }}
          >
            <Grid
              container
              spacing={{ xs: 1.5, sm: 2 }}
              alignItems="flex-start"
              sx={{ width: { xs: "100%", sm: "auto", lg: "100%" } }}
            >
              {/*================================ Primary Skills Section==================================== */}
              <Grid
                size={{ xs: 12, sm: 4, lg: 4 }}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", sm: "flex-start" },
                }}
              >
                <Typography
                  ml={1}
                  variant="subtitle1"
                  gutterBottom
                  className={classes.subtitle}
                >
                  Primary Skills
                </Typography>
                <Box
                  sx={{
                    display: { sm: "block", md: "flex", lg: "flex" },
                    // display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 1, lg: 4 },
                    // flexWrap: "wrap",
                    width: "100%",
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  {primarySkills.map((skill) => (
                    <Box key={skill.key}>
                      <Button
                        variant="contained"
                        onClick={() => toggleSkill(skill.key)}
                        sx={{
                          margin: 1,
                          width: { xs: "100%", sm: "auto", lg: "100%" },
                          borderRadius: "20px",
                          backgroundColor: isSelected(skill.key)
                            ? theme.palette.secondary.dark
                            : theme.palette.secondary.light,
                          color: isSelected(skill.key)
                            ? theme.palette.white
                            : theme.palette.text.main,
                        }}
                      >
                        {skill.lable}
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* ================================ Mandatory Skills Section ==================================*/}
              <Grid
                size={{ xs: 12, sm: 4, lg: 4 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  ml: { lg: -2 },
                  alignItems: { xs: "center", sm: "flex-start" },
                }}
              >
                <Typography
                  variant="subtitle1"
                  ml={1}
                  gutterBottom
                  className={classes.subtitle}
                >
                  Mandatory Skills
                </Typography>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "80%", lg: "100%" },
                    minWidth: { xs: "100%", sm: "40%" },
                    mt: -2,
                  }}
                >
                  <Dropdown
                    label="Mandatory Skills"
                    multiple={true}
                    options={mandatorySkills || []}
                    getOptionLabel={(option) => option.lable}
                    value={selectedMandatoryhSkills}
                    onChange={(e, newValue) => {
                      setSelectedMandatorySkills(newValue);
                      setSecondaryLoading(false);
                    }}
                    placeholder="Select Mandatory Skills"
                    disableCloseOnSelect
                    onOpen={() => {
                      setMandatoryLoading(true);
                    }}
                    sx={{
                      maxHeight: 120,
                      overflowY: "auto", // Enable scrolling
                      "&::-webkit-scrollbar": {
                        width: 1, // Thin scrollbar width
                        backgroundColor: "#fffff", // Optional: background for visibility
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#ffff", // Optional: thumb color for contrast
                        borderRadius: "2px", // Optional: rounded edges for aesthetics
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/*================================== Secondary Skills Section =================================*/}
              <Grid
                size={{ xs: 12, sm: 4, lg: 4 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", sm: "flex-start" },
                }}
              >
                <Typography
                  ml={1}
                  variant="subtitle1"
                  gutterBottom
                  className={classes.subtitle}
                >
                  Secondary Skills
                </Typography>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "80%", lg: "100%" },
                    minWidth: { xs: "100%", sm: "40%" },
                    mt: -2,
                  }}
                >
                  <Dropdown
                    label="Secondary Skills"
                    multiple={true}
                    options={secondarySkills || []}
                    value={selectedSecondarySkills}
                    getOptionLabel={(option) => option.lable}
                    onChange={(e, newValue) => {
                      setSelectedSecondarySkills(newValue);
                    }}
                    placeholder="Select Secondary Skills"
                    disableCloseOnSelect
                    onOpen={() => {
                      setSecondaryLoading(true);
                    }}
                    sx={{ maxHeight: 120, overflowY: "auto" }}
                  />
                </Box>
              </Grid>

              {/*============================ Years of Experience Section ==================================*/}
              <Grid
                size={{ xs: 12, sm: 12, lg: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", sm: "flex-start" },
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  className={classes.subtitle}
                >
                  Years of Experience
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 3 },
                    alignItems: { xs: "center", sm: "flex-start" },
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 1, sm: 2 },
                      flexDirection: { xs: "column", sm: "row" },
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <TextField
                      required
                      label="Min"
                      variant="outlined"
                      placeholder="Min"
                      type="number"
                      size="small"
                      name="min"
                      onChange={handleExperience}
                      inputProps={{ min: 0 }}
                      error={!!experienceError}
                      sx={{ width: { xs: "100%", sm: 120, lg: 150 } }}
                    />
                    <TextField
                      label="Max"
                      variant="outlined"
                      placeholder="Max"
                      type="number"
                      size="small"
                      inputProps={{ min: experience.min || 0 }}
                      name="max"
                      onChange={handleExperience}
                      error={!!experienceError}
                      helperText={experienceError}
                      sx={{ width: { xs: "100%", sm: 120, lg: 150 } }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: { xs: "100%", sm: 200, lg: 250 },
                      mt: { lg: "-16px", sm: "-16px" },
                    }}
                  >
                    <Dropdown
                      label="Availability"
                      options={availability}
                      getOptionLabel={(option) => option.label}
                      value={selectedAvailability}
                      onChange={(e, newValue) =>
                        setSelectedAvailability(newValue)
                      }
                      placeholder="Select Availability"
                      sx={{ maxHeight: 120 }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      {/* =================================== Instructions Section  ====================================== */}
      <Grid
        container
        spacing={{ xs: 1, sm: 2, lg: 12 }}
        sx={{ ml: { sm: -6, lg: 2 }, width: { lg: "98%" } }}
      >
        <Grid
          container
          size={{ xs: 12, sm: 12, lg: 12 }}
          spacing={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            p: { xs: 2, sm: 3 },
            boxShadow:
              "0px 8px 24px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.08)",
            maxWidth: { xs: "100%", sm: "700px", lg: "100%" },
            mx: "auto",
            borderRadius: "4px",
            mt: 1,
          }}
        >
          <Grid mt={1} item size={{ xs: 12, sm: 12, lg: 6, lg: 6 }}>
            <TextField
              label="Add more instructions here"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              margin="normal"
              value={instructions}
              onChange={handleInstructionsChange}
              sx={{
                borderRadius: "16px",
                "& .MuiInputBase-root": {
                  padding: "8px",
                  lineHeight: "1.2",
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.875rem",
                },
              }}
              error={isError}
              helperText={
                isError
                  ? `Character limit exceeded by ${
                      instructions.length - maxLength
                    }`
                  : `${instructions.length}/${maxLength} characters`
              }
              inputProps={{ maxLength: maxLength + 100 }}
            />
          </Grid>
          <Grid
            item
            ml={3}
            size={{ xs: 12, sm: 12, lg: 1 }}
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            (or)
          </Grid>
          <Grid
            item
            mt={-1}
            size={{ xs: 12, sm: 12, lg: 4, lg: 4 }}
            sx={{ ml: { xs: 2 }, mt: { xs: 2 } }}
          >
            <Box
              className={classes.uploadSection}
              sx={{
                // backgroundColor: theme.palette.grey[100] || "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              {!file && (
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    borderRadius: "16px",
                    textTransform: "none",
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                  }}
                  aria-label="Upload requisition file"
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf, .txt, .doc, .docx, .xsl, .xlsx"
                  />
                </Button>
              )}
              {file && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    className={classes.selectedFileText}
                  >
                    Selected file: {file.name}
                  </Typography>
                  <IconButton
                    onClick={() => setFile(null)}
                    sx={{
                      marginLeft: 1,
                      color: theme.palette.error.main,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}
              {fileError && (
                <Typography variant="body2" className={classes.fileErrorText}>
                  {fileError}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* ========================Upload Section================================ */}
        <Grid
          size={{ xs: 12, sm: 12, lg: 12 }}
          mb={5}
          ml={4}
          display={"flex"}
          justifyContent={"center"}
          sx={{ width: "100%", mt: { lg: -11 } }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{
              color: "white",
              borderRadius: "20px",
              width: { xs: "100%", sm: "auto" },
              my: { xs: 1, sm: 2 },
              padding: "6px 40px",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      {openDialog && (
        <Dialog
          open={openDialog}
          onClose={(event, reason) => {
            if (reason && reason === "backdropClick") return;
            setOpenDialog(false);
          }}
          maxWidth="md"
          fullWidth
          aria-describedby="alert-dialog-slide-description"
          sx={{
            ".MuiDialog-paper": {
              background: "white",
              overflow: "hidden",
            },
            zIndex: 1200,
          }}
        >
          <ExpressRequirements
            questionsData={questionsData}
            closeDialog={() => setOpenDialog(false)}
          />
        </Dialog>
      )}
    </Box>
  );
});

export default JobRequirements;
