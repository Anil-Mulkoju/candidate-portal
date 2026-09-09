import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Checkbox,
  Grid,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useDispatch, useSelector } from "react-redux";
import { isValid, format } from "date-fns";
import { toast } from "react-toastify";
import StepPageLayout from "../../../../../../components/StepPageLayout/index.jsx";
import {
  useGetCandidateCountriesQuery,
  useLazyGetCandidateLocationsQuery,
  useGetWorkAuthorizationsQuery,
  useUpdatePersonalDetailsMutation,
} from "../../../../../../store/api/settings/CandidatePortalApis";
import {
  candidateSetInitialData,
  candidateUpdateFormData,
} from "../../../../../../store/slices/candidateSlice";
import { candidateGetUserDetails } from "../../../../../../utils/candidateReigister.js";
import { CANDIDATE_ACCESS_TOKEN, getItem } from "../../../../../../utils/helper.js";

/* ── Design tokens — shared visual system across Employment / Education / Personal ── */
const INK          = "#1F2937";
const TEXT_MUTED   = "#6B7280";
const PRIMARY      = "#2B6F71";
const PRIMARY_DARK = "#1E4F50";
const PRIMARY_TINT = "#EAF5F4";
const SURFACE      = "#F8FAF9"; // section panel background
const BORDER       = "#E1E5E7"; // softer than the old #E3E7EE

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: "#fff",
    fontSize: "14px",
    "& fieldset": { borderColor: BORDER },
    "&:hover fieldset": { borderColor: PRIMARY },
    "&.Mui-focused fieldset": { borderColor: PRIMARY, borderWidth: "1.5px" },
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    boxShadow: `0 0 0 3px ${PRIMARY_TINT}`,
  },
  "& .MuiInputLabel-root": { fontSize: "13.5px", color: TEXT_MUTED },
  "& .MuiInputLabel-root.Mui-focused": { color: PRIMARY },
  "& .MuiFormHelperText-root": { fontSize: "11px", mt: "3px" },
};

const checkboxSx = { color: PRIMARY, "&.Mui-checked": { color: PRIMARY } };

/* ── Section header — icon badge + title, sits above a tinted panel ─────── */
const SectionHeader = ({ icon: Icon, title }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, mb: 1.75 }}>
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "8px",
        background: PRIMARY_TINT,
        color: PRIMARY_DARK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 17 }} />
    </Box>
    <Typography sx={{ fontSize: 15, fontWeight: 700, color: INK }}>
      {title}
    </Typography>
  </Box>
);

/* ── Section panel — replaces the old "divider only" grouping ───────────── */
const SectionPanel = ({ icon, title, children }) => (
  <Box
    sx={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: "14px",
      p: { xs: 2, sm: 2.5 },
      mb: 2.5,
    }}
  >
    <SectionHeader icon={icon} title={title} />
    {children}
  </Box>
);

/* ── Segmented chip selector — matches app-wide chip pattern ─────────────── */
const ChipSelect = ({ label, options, value, onChange, error }) => (
  <Box>
    <Typography sx={{ fontSize: "12.5px", color: TEXT_MUTED, mb: 0.6 }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <Box
            key={opt}
            onClick={() => onChange(opt)}
            sx={{
              cursor: "pointer",
              textAlign: "center",
              borderRadius: "9px",
              border: selected ? `1.5px solid ${PRIMARY}` : `1px solid ${BORDER}`,
              background: "#fff",
              boxShadow: selected ? `0 0 0 3px ${PRIMARY_TINT}` : "none",
              color: selected ? PRIMARY_DARK : "#4B5563",
              fontWeight: selected ? 700 : 500,
              fontSize: "13.5px",
              py: 0.95,
              px: 2.25,
              minWidth: 76,
              transition: "all .15s ease",
              "&:hover": { borderColor: PRIMARY },
            }}
          >
            {selected ? "✓ " : ""}
            {opt}
          </Box>
        );
      })}
    </Box>
    {error && (
      <Typography sx={{ fontSize: "11px", color: "#d32f2f", mt: 0.5 }}>
        {error}
      </Typography>
    )}
  </Box>
);

const genders = ["Male", "Female", "Other"];
const maritalOptions = ["Married", "UnMarried"];
const languageOptions = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
];

const PersonalDetails = ({ handleBack, activeStep, handleStepClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const candidateDetails = useSelector(
    (state) => state?.candidate?.formData?.candidateDetails || {}
  );

  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [countries, setCountries] = useState([]);
  const [stateAndCityOptions, setStateAndCityOptions] = useState([]);
  const [workAuthorizationOptions, setWorkAuthorizationOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedStateAndCity, setSelectedStateAndCity] = useState(null);
  const [errors, setErrors] = useState({});
  const [updatePersonalDetails, { isLoading: isUpdating }] = useUpdatePersonalDetailsMutation();
  const { data: countriesData, isLoading: isCountriesLoading } =
    useGetCandidateCountriesQuery();
  const [triggerGetLocations] = useLazyGetCandidateLocationsQuery();

  // Fields ordered to match the API payload shape
  const [localData, setLocalData] = useState({
    dob: null,
    gender: "",
    marriage: "",
    nationality: "",
    languagesKnown: [],
    currentAddress: "",
    permanentAddress: "",
    preferredSalary: "",
    country: "",
    stateAndCity: "",
    workAuthorization: "",
    pinCode: "",
    willingToRelocate: false,
  });
  const isUnitedStates = ["united states", "us", "usa", "united states of america"].includes(
    localData.country?.trim().toLowerCase()
  );
  const { data: workAuthorizationsData, isLoading: isWorkAuthorizationsLoading } =
    useGetWorkAuthorizationsQuery("united states", { skip: !isUnitedStates });

  useEffect(() => {
    const countriesList = Array.isArray(countriesData)
      ? countriesData
      : countriesData?.data ?? [];
    setCountries(countriesList);
  }, [countriesData]);
// Data the user already saved on a previous visit to this step
const savedPersonalDetails = useSelector(
  (state) => state?.candidate?.formData?.personalDetails
);
const hasSavedPersonalDetails = Object.keys(savedPersonalDetails || {}).length > 0;

  // Populates Redux with resume_data if this step is opened before any
  // earlier step (Employment, Education) has already fetched it — otherwise
  // candidateDetails.resume_data stays empty and none of the autofill below
  // ever fires. Guarded by the resume_data check so it only runs once.
  useEffect(() => {
    if (candidateDetails?.resume_data) return;

    const fetchDetails = async () => {
      const token = getItem(CANDIDATE_ACCESS_TOKEN);
      const details = await candidateGetUserDetails(token, () => {});
      if (details) dispatch(candidateSetInitialData(details));
    };
    fetchDetails();
  }, [candidateDetails?.resume_data, dispatch]);

useEffect(() => {
  if (hasSavedPersonalDetails) {
    // Already in localData's own shape — use directly
    setLocalData((prev) => ({ ...prev, ...savedPersonalDetails }));
    return;
  }

  const pd = candidateDetails?.resume_data?.personal_details || {};
  if (!Object.keys(pd).length) return;
  setLocalData((prev) => ({
    ...prev,
    dob: pd.date_of_birth ? new Date(pd.date_of_birth) : null,
    gender: pd.gender || "",
    marriage: pd.marital_status || "",
    nationality: pd.nationality || "",
    languagesKnown: pd.languages_known
      ? (Array.isArray(pd.languages_known)
          ? pd.languages_known
          : pd.languages_known.split(",").map((l) => l.trim()))
      : [],
    currentAddress: pd.address || "",
    permanentAddress: pd.present_address || "",
    preferredSalary: pd.preferred_salary || "",
    country: pd.country || "",
    stateAndCity: pd.city || pd.state || "",
    workAuthorization: pd.work_authorization || "",
    pinCode: pd.pincode || "",
    willingToRelocate: !!pd.willing_to_relocate,
  }));

  if (pd.country) {
    setSelectedCountry(pd.country);
    // Without this, stateAndCityOptions stays empty after autofill — the
    // saved value still displays (the field is freeSolo) but the dropdown
    // itself has no suggestions until the user manually re-picks a country.
    (async () => {
      try {
        const response = await triggerGetLocations(pd.country).unwrap();
        const locationsList = Array.isArray(response)
          ? response
          : response?.data ?? [];
        setStateAndCityOptions(locationsList);
      } catch (error) {
        console.error("Error fetching states/cities:", error);
      }
    })();
  }
  if (pd.city || pd.state) setSelectedStateAndCity(pd.city || pd.state);
}, [candidateDetails, hasSavedPersonalDetails, savedPersonalDetails, triggerGetLocations]);
  const handleChange = (key) => (event) => {
    const value = event.target.value;
    setLocalData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "currentAddress" && sameAsCurrent)
        updated.permanentAddress = value;
      return updated;
    });
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleDateChange = (key) => (date) => {
    setLocalData((prev) => ({ ...prev, [key]: date }));
    setErrors((prev) => ({ ...prev, dob: "" }));
  };

  const handleAutoCompleteChange = (key) => (_e, value) => {
    setLocalData((prev) => ({ ...prev, [key]: value || "" }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleChipChange = (key) => (value) => {
    setLocalData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleLanguagesChange = (_e, value) => {
    setLocalData((prev) => ({ ...prev, languagesKnown: value || [] }));
    setErrors((prev) => ({ ...prev, languagesKnown: "" }));
  };

  const handleCheckboxField = (key) => (event) => {
    setLocalData((prev) => ({ ...prev, [key]: event.target.checked }));
  };

  const handleSameAsCurrent = (event) => {
    const isChecked = event.target.checked;
    setSameAsCurrent(isChecked);
    setLocalData((prev) => ({
      ...prev,
      permanentAddress: isChecked ? prev.currentAddress : "",
    }));
    if (isChecked) setErrors((prev) => ({ ...prev, permanentAddress: "" }));
  };

  const handleSelectCountry = async (country) => {
    setSelectedCountry(country);
    setLocalData((prev) => ({
      ...prev,
      country,
      workAuthorization:
        ["united states", "us", "usa", "united states of america"].includes(
          country?.trim().toLowerCase()
        )
          ? prev.workAuthorization
          : "",
    }));
    setErrors((prev) => ({ ...prev, country: "" }));
    if (!country) {
      setStateAndCityOptions([]);
      return;
    }

    try {
      const response = await triggerGetLocations(country).unwrap();
      const locationsList = Array.isArray(response)
        ? response
        : response?.data ?? [];
      setStateAndCityOptions(locationsList);
    } catch (error) {
      console.error("Error fetching states/cities:", error);
      setStateAndCityOptions([]);
    }
  };

  useEffect(() => {
    const authorizations = Array.isArray(workAuthorizationsData?.data)
      ? workAuthorizationsData.data
      : Array.isArray(workAuthorizationsData)
        ? workAuthorizationsData
        : [];
    setWorkAuthorizationOptions(authorizations);
  }, [workAuthorizationsData]);

  const validate = () => {
    let tempErrors = {};
    if (!localData.dob) tempErrors.dob = "Date of Birth is required";
    if (!localData.gender) tempErrors.gender = "Gender is required";
    if (!localData.marriage) tempErrors.marriage = "Marital Status is required";
    if (!localData.nationality)
      tempErrors.nationality = "Nationality is required";
    if (!localData.languagesKnown.length)
      tempErrors.languagesKnown = "At least one language is required";
    if (!localData.currentAddress)
      tempErrors.currentAddress = "Current Address is required";
    if (!localData.permanentAddress)
      tempErrors.permanentAddress = "Permanent Address is required";
    if (!localData.country) tempErrors.country = "Country is required";
    if (isUnitedStates && !localData.workAuthorization)
      tempErrors.workAuthorization = "Work authorization is required";
    if (!localData.stateAndCity)
      tempErrors.stateAndCity = "State & City is required";
    if (!localData.pinCode) tempErrors.pinCode = "Pincode is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveAndNext = () => {
  // if (!validate()) return;
  dispatch(candidateUpdateFormData({ section: "personalDetails", updates: localData })); 

    const payload = {
      date_of_birth:
        localData.dob && isValid(localData.dob)
          ? format(localData.dob, "yyyy-MM-dd")
          : null,
      gender: localData.gender,
      marital_status: localData.marriage,
      nationality: localData.nationality,
      languages_known: localData.languagesKnown,
      address: localData.currentAddress,
      present_address: localData.permanentAddress,
      preferred_salary: Number(localData.preferredSalary) || 0,
      city: localData.stateAndCity,
      state: localData.stateAndCity,
      country: localData.country,
      work_authorization: isUnitedStates ? localData.workAuthorization : "",
      pincode: localData.pinCode,
      willing_to_relocate: localData.willingToRelocate,
    };

    const save = async () => {
      try {
        const res = await updatePersonalDetails(payload).unwrap();
        if (res?.success || res?.data?.success) navigate("/for-candidate/profile");
      } catch (error) {
        toast.error(error?.data?.message || error?.message || "An error occurred");
      }
    };
    save();
  };

  return (
    <StepPageLayout activeStep={activeStep} handleStepClick={handleStepClick}>
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.25 }}>
          Personal Details
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: TEXT_MUTED, mt: 0.4, lineHeight: 1.35 }}>
          Enter your contact and personal information to finish setting up your profile.
        </Typography>
      </Box>

      {/* Basic Info */}
      <SectionPanel icon={PersonRoundedIcon} title="Basic Info">
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={localData.dob}
                onChange={handleDateChange("dob")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    error: !!errors.dob,
                    helperText: errors.dob,
                    sx: fieldSx,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Nationality"
              value={localData.nationality || ""}
              onChange={handleChange("nationality")}
              error={!!errors.nationality}
              helperText={errors.nationality}
              sx={fieldSx}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <ChipSelect
              label="Gender"
              options={genders}
              value={localData.gender}
              onChange={handleChipChange("gender")}
              error={errors.gender}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <ChipSelect
              label="Marital Status"
              options={maritalOptions}
              value={localData.marriage}
              onChange={handleChipChange("marriage")}
              error={errors.marriage}
            />
          </Grid>
        </Grid>
      </SectionPanel>

      {/* Languages & Salary */}
      <SectionPanel icon={ChatBubbleOutlineRoundedIcon} title="Languages & Salary">
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              multiple
              options={languageOptions}
              value={localData.languagesKnown}
              onChange={handleLanguagesChange}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Languages Known"
                  error={!!errors.languagesKnown}
                  helperText={errors.languagesKnown}
                  sx={fieldSx}
                />
              )}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Preferred Salary"
              type="number"
              value={localData.preferredSalary || ""}
              onChange={handleChange("preferredSalary")}
              error={!!errors.preferredSalary}
              helperText={errors.preferredSalary}
              sx={fieldSx}
            />
          </Grid>
        </Grid>
      </SectionPanel>

      {/* Address */}
      <SectionPanel icon={HomeRoundedIcon} title="Address">
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              label="Current Address"
              value={localData.currentAddress || ""}
              onChange={handleChange("currentAddress")}
              error={!!errors.currentAddress}
              helperText={errors.currentAddress}
              sx={fieldSx}
            />
          </Grid>
          <Grid item size={{ xs: 12 }} sx={{ mt: -1.2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sameAsCurrent}
                  onChange={handleSameAsCurrent}
                  size="small"
                  sx={checkboxSx}
                />
              }
              label={
                <Typography sx={{ fontSize: "13px", color: "#4B5563" }}>
                  Same as current address
                </Typography>
              }
            />
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              label="Permanent Address"
              value={localData.permanentAddress || ""}
              onChange={handleChange("permanentAddress")}
              error={!!errors.permanentAddress}
              helperText={errors.permanentAddress}
              sx={fieldSx}
            />
          </Grid>
        </Grid>
      </SectionPanel>

      {/* Location */}
      <SectionPanel icon={PlaceRoundedIcon} title="Location">
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <Autocomplete
              freeSolo
              options={countries}
              value={selectedCountry || ""}
              onChange={(_e, value) => handleSelectCountry(value)}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  error={!!errors.country}
                  helperText={errors.country}
                  sx={fieldSx}
                />
              )}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <Autocomplete
              freeSolo
              options={stateAndCityOptions}
              disabled={!selectedCountry}
              value={selectedStateAndCity || ""}
              onChange={(_e, value) => {
                setSelectedStateAndCity(value);
                setLocalData((prev) => ({
                  ...prev,
                  stateAndCity: value || "",
                }));
                setErrors((prev) => ({ ...prev, stateAndCity: "" }));
              }}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State & City"
                  error={!!errors.stateAndCity}
                  helperText={errors.stateAndCity}
                  sx={fieldSx}
                />
              )}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Pincode"
              value={localData.pinCode || ""}
              onChange={handleChange("pinCode")}
              error={!!errors.pinCode}
              helperText={errors.pinCode}
              sx={fieldSx}
            />
          </Grid>
          {isUnitedStates && (
            <Grid item size={{ xs: 12, sm: 4 }}>
              <Autocomplete
                options={workAuthorizationOptions}
                loading={isWorkAuthorizationsLoading}
                value={workAuthorizationOptions.find(
                  (option) => option.value === localData.workAuthorization
                ) || null}
                onChange={(_e, option) => {
                  setLocalData((prev) => ({
                    ...prev,
                    workAuthorization: option?.value || "",
                  }));
                  setErrors((prev) => ({ ...prev, workAuthorization: "" }));
                }}
                getOptionLabel={(option) => option?.value || ""}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Work Authorization"
                    error={!!errors.workAuthorization}
                    helperText={errors.workAuthorization}
                    sx={fieldSx}
                  />
                )}
              />
            </Grid>
          )}
          <Grid item size={{ xs: 12 }} sx={{ mt: -0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localData.willingToRelocate}
                  onChange={handleCheckboxField("willingToRelocate")}
                  size="small"
                  sx={checkboxSx}
                />
              }
              label={
                <Typography sx={{ fontSize: "13px", color: "#4B5563" }}>
                  Willing to relocate
                </Typography>
              }
            />
          </Grid>
        </Grid>
      </SectionPanel>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Button
          onClick={handleBack}
          variant="outlined"
          sx={{
            borderColor: BORDER,
            color: "#4B5563",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              borderColor: PRIMARY,
              background: PRIMARY_TINT,
            },
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveAndNext}
          disabled={isUpdating}
          sx={{
            background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
            color: "#fff",
            minWidth: 140,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            py: 1,
            boxShadow: "none",
            "&:hover": {
              background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY_DARK} 100%)`,
            },
          }}
        >
          {isUpdating ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            "Save & Next"
          )}
        </Button>
      </Box>
    </StepPageLayout>
  );
};

PersonalDetails.propTypes = {
  handleBack: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  handleStepClick: PropTypes.func.isRequired,
};

export default PersonalDetails;