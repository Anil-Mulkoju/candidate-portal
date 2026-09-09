import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Paper,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parseISO, format } from "date-fns";
import Dropdown from "../../../../components/Common/Dropdown";
import {
  useGetCandidateCountriesQuery,
  useLazyGetCandidateLocationsQuery,
  useGetPersonalDetailsQuery,
  useUpdatePersonalDetailsMutation,
  useLazyGetWorkAuthorizationsQuery,
} from "../../../../store/api/settings/CandidatePortalApis";
import { palette, fonts } from "../../../../theme/candidateTokens";

const genders = ["Male", "Female", "Other"];
const maritalOptions = ["Married", "Unmarried"];
const isUSA = (value) =>
  value?.trim().toLowerCase() === "united states";

const dialogFieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: palette.line },
    "&:hover fieldset": { borderColor: palette.teal },
    "&.Mui-focused fieldset": { borderColor: palette.teal },
  },
};

const DetailRow = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: { xs: 0.8, sm: 1.25 },
      mb: 1.4,
      width: "100%",
      minWidth: 0,
    }}
  >
    {/* Icon */}
    <Box
      sx={{
        color: palette.teal,
        display: "flex",
        flexShrink: 0,
        mt: "2px",
      }}
    >
      {icon}
    </Box>

    {/* Label */}
    <Typography
      sx={{
        fontSize: { xs: 10.5, sm: 12 },
        color: palette.muted,
        width: { xs: 85, sm: 120 },
        minWidth: { xs: 85, sm: 120 },
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>

    {/* Value */}
    <Typography
      sx={{
        fontSize: { xs: 11.5, sm: 13.5 },
        color: palette.ink,
        flex: 1,
        minWidth: 0,
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        whiteSpace: "normal",
      }}
    >
      {value || "—"}
    </Typography>
  </Box>
);

function Personaldetails({ onSectionComplete }) {
  const {
    data: personalDetailsData,
    isLoading: isProfileLoading,
    refetch: refetchPersonalDetails,
  } = useGetPersonalDetailsQuery();

  const candidateCompleateDetails =
    personalDetailsData?.data ?? personalDetailsData;

  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [stateAndCity, setStateAndCity] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const { data: countriesData } = useGetCandidateCountriesQuery();
  const [triggerGetLocations] = useLazyGetCandidateLocationsQuery();
  const [updatePersonalDetails] = useUpdatePersonalDetailsMutation();
  const [workAuthOptions, setWorkAuthOptions] = useState([]);
  const [triggerGetWorkAuthorizations] = useLazyGetWorkAuthorizationsQuery();

  const [personalData, setPersonalData] = useState({
    gender: "",
    dob: null,
    marriage: "",
    currentAddress: "",
    permanentAddress: "",
    nationality: "",
    country: "",
    stateAndCity: "",
    workAuthorization: "",
    pinCode: "",
  });

  // Sync local form state whenever the candidate profile data loads/changes
  useEffect(() => {
    if (!candidateCompleateDetails) return;

    setPersonalData({
      gender: candidateCompleateDetails?.gender || "",
      dob: candidateCompleateDetails?.date_of_birth
        ? parseISO(candidateCompleateDetails.date_of_birth)
        : null,
      marriage: candidateCompleateDetails?.marital_status || "",
      currentAddress: candidateCompleateDetails?.present_address || "",
      permanentAddress: candidateCompleateDetails?.address || "",
      nationality: candidateCompleateDetails?.nationality || "",
      country: candidateCompleateDetails?.country || "",
      stateAndCity: candidateCompleateDetails?.state || "",
      workAuthorization: candidateCompleateDetails?.work_authorization || "",
      pinCode: candidateCompleateDetails?.pincode || "",
    });
    setSelectedCountry(candidateCompleateDetails?.country || "");
  }, [candidateCompleateDetails]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (key) => (date) => {
    setPersonalData((prev) => ({
      ...prev,
      [key]: date,
    }));
    setErrors((prev) => ({ ...prev, dob: "" }));
  };

  const handleDropdownChange = (key) => (event, newValue) => {
    setPersonalData((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleSelectCountry = async (country) => {
    const formattedCountry = country
      ?.trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

    setSelectedCountry(formattedCountry);

    setPersonalData((prev) => ({
      ...prev,
      country: formattedCountry,
      // clear work authorization if the new country isn't US
      workAuthorization: isUSA(formattedCountry) ? prev.workAuthorization : "",
    }));

    if (formattedCountry) {
      try {
        const response = await triggerGetLocations(formattedCountry).unwrap();
        const locations = Array.isArray(response) ? response : response?.data ?? [];
        setStateAndCity(locations);
      } catch (error) {
        console.error("Error fetching states/cities:", error);
        setStateAndCity([]);
      }
    } else {
      setStateAndCity([]);
    }

    if (isUSA(formattedCountry)) {
      try {
        const response = await triggerGetWorkAuthorizations(formattedCountry).unwrap();
        const options = Array.isArray(response) ? response : response?.data ?? [];
        setWorkAuthOptions(options.map((item) => item.value));
      } catch (error) {
        console.error("Error fetching work authorizations:", error);
        setWorkAuthOptions([]);
      }
    } else {
      setWorkAuthOptions([]);
    }
  };
  useEffect(() => {
    if (!open) return;
    if (selectedCountry !== "United States") return;
    if (workAuthOptions.length > 0) return; // already loaded, don't refetch

    (async () => {
      try {
        const response = await triggerGetWorkAuthorizations(selectedCountry).unwrap();
        const options = Array.isArray(response) ? response : response?.data ?? [];
        setWorkAuthOptions(options.map((item) => item.value));
      } catch (error) {
        console.error("Error fetching work authorizations:", error);
        setWorkAuthOptions([]);
      }
    })();
  }, [open, selectedCountry, workAuthOptions.length, triggerGetWorkAuthorizations]);

  const validate = () => {
    let tempErrors = {};
    if (!personalData.gender) tempErrors.gender = "Gender is required";
    if (!personalData.dob) tempErrors.dob = "Date of Birth is required";
    if (!personalData.marriage)
      tempErrors.marriage = "Marital Status is required";
    if (!personalData.currentAddress)
      tempErrors.currentAddress = "Current Address is required";
    if (!personalData.permanentAddress)
      tempErrors.permanentAddress = "Permanent Address is required";
    if (!personalData.nationality)
      tempErrors.nationality = "Nationality is required";
    if (!personalData.country) tempErrors.country = "Country is required";
    if (!personalData.stateAndCity)
      tempErrors.stateAndCity = "State & City is required";
    if (!personalData.pinCode) tempErrors.pinCode = "Pincode is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const payload = {
          date_of_birth: personalData.dob,
          gender: personalData.gender,
          marital_status: personalData.marriage,
          nationality: personalData.nationality,
          languages_known: ["string"],
          address: personalData.permanentAddress,
          present_address: personalData.currentAddress,
          preferred_salary: 0,
          city: personalData.stateAndCity,
          state: personalData.stateAndCity,
          country: personalData.country,
          work_authorization: personalData.workAuthorization || "",
          pincode: personalData.pinCode,
          willing_to_relocate: false,
        };

        const response = await updatePersonalDetails(payload).unwrap();

        refetchPersonalDetails();

        onSectionComplete("personal", true);
        handleClose();
      } catch (error) {
        console.error("Error updating personal details:", error);
      }
    } else {
      console.log("Validation failed:", errors);
    }
  };

  useEffect(() => {
    const countriesList = Array.isArray(countriesData)
      ? countriesData
      : countriesData?.data ?? [];
    setCountries(countriesList);
  }, [countriesData]);

  return (
    <Paper
      elevation={0}
      sx={{ bgcolor: palette.paper, border: `1px solid ${palette.line}`, borderRadius: "14px", p: { xs: 2.5, sm: 3 } }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1.5}>
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
            <BadgeOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 17, color: palette.ink }}>
            Personal Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: palette.teal, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: palette.tealDeep } }}
          onClick={handleOpen}
        >
          {candidateCompleateDetails ? "Edit Personal Details" : "+ Add Personal Details"}
        </Button>
      </Box>

      {isProfileLoading && (
        <Typography sx={{ color: palette.muted, fontSize: 13.5, mt: 2 }}>
          Loading personal details...
        </Typography>
      )}
      {!isProfileLoading && !candidateCompleateDetails && (
        <Typography sx={{ color: palette.muted, fontSize: 13.5, mt: 2 }}>
          No personal details added yet.
        </Typography>
      )}

      {/* Display saved personal details */}
      {candidateCompleateDetails && (
        <Box sx={{ mt: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DetailRow icon={<BadgeOutlinedIcon sx={{ fontSize: 18 }} />} label="Gender" value={personalData.gender} />
              <DetailRow
                icon={<CakeOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Date of Birth"
                value={
                  personalData.dob instanceof Date && !isNaN(personalData.dob)
                    ? format(personalData.dob, "yyyy-MM-dd")
                    : ""
                }
              />
              <DetailRow
                icon={<FavoriteBorderOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Marital Status"
                value={personalData.marriage}
              />
              <DetailRow
                icon={<PublicOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Nationality"
                value={personalData.nationality}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow
                icon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Current Address"
                value={personalData.currentAddress}
              />
              <DetailRow
                icon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Permanent Address"
                value={personalData.permanentAddress}
              />
              <DetailRow
                icon={<PublicOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Location"
                value={[personalData.stateAndCity, personalData.country].filter(Boolean).join(", ")}
              />
              <DetailRow
                icon={<BadgeOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Work Authorization"
                value={personalData.workAuthorization}
              />
              <DetailRow
                icon={<MarkunreadMailboxOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Pincode"
                value={personalData.pinCode}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Add Personal Details Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "14px" } }}>
        <DialogTitle sx={{ fontFamily: fonts.display, fontWeight: 600, color: palette.ink }}>
          {candidateCompleateDetails ? "Edit Personal Details" : "Add Personal Details"}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: palette.teal }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {Object.keys(errors).length > 0 && (
            <Typography sx={{ color: palette.coral, mb: 2 }} variant="caption">
              Please correct the errors below
            </Typography>
          )}
          <Typography sx={{ fontWeight: 600, color: palette.ink }} gutterBottom>
            Gender
          </Typography>
          <RadioGroup row name="gender" value={personalData.gender} onChange={handleChange}>
            {genders.map((gender) => (
              <FormControlLabel
                key={gender}
                value={gender}
                control={<Radio sx={{ color: palette.teal, "&.Mui-checked": { color: palette.teal } }} />}
                label={<Typography fontSize="13px">{gender}</Typography>}
              />
            ))}
          </RadioGroup>
          {errors.gender && (
            <Typography sx={{ color: palette.coral }} variant="caption">
              {errors.gender}
            </Typography>
          )}

          <Typography sx={{ fontWeight: 600, color: palette.ink, mt: 2 }}>Date of Birth</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth"
              name="dob"
              value={personalData?.dob || null}
              onChange={handleDateChange("dob")}
              slots={{ textField: TextField }}
              slotProps={{
                textField: { margin: "dense", fullWidth: true, sx: dialogFieldSx },
                popper: {
                  modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
                  sx: { zIndex: 1300, backgroundColor: "white" },
                },
              }}
            />
          </LocalizationProvider>
          {errors.dob && (
            <Typography sx={{ color: palette.coral }} variant="caption">
              {errors.dob}
            </Typography>
          )}

          <Typography sx={{ fontWeight: 600, color: palette.ink, mt: 2 }}>Marital Status</Typography>
          <Dropdown
            label="Select Marital Status"
            options={maritalOptions}
            value={personalData.marriage}
            onChange={handleDropdownChange("marriage")}
            color={palette.teal}
          />
          {errors.marriage && (
            <Typography sx={{ color: palette.coral }} variant="caption">
              {errors.marriage}
            </Typography>
          )}

          <Typography sx={{ fontWeight: 600, color: palette.ink, mt: 2 }}>Current Address</Typography>
          <TextField
            fullWidth
            label="Current Address"
            name="currentAddress"
            margin="dense"
            sx={dialogFieldSx}
            value={personalData.currentAddress}
            onChange={handleChange}
          />
          {errors.currentAddress && (
            <Typography sx={{ color: palette.coral }} variant="caption">
              {errors.currentAddress}
            </Typography>
          )}

          <Typography sx={{ fontWeight: 600, color: palette.ink, mt: 2 }}>Permanent Address</Typography>
          <TextField
            fullWidth
            label="Permanent Address"
            name="permanentAddress"
            margin="dense"
            sx={dialogFieldSx}
            value={personalData.permanentAddress}
            onChange={handleChange}
          />
          {errors.permanentAddress && (
            <Typography sx={{ color: palette.coral }} variant="caption">
              {errors.permanentAddress}
            </Typography>
          )}

          <Typography sx={{ fontWeight: 600, color: palette.ink, mt: 2 }}>Nationality</Typography>
          <TextField
            fullWidth
            label="Nationality"
            name="nationality"
            margin="dense"
            sx={dialogFieldSx}
            value={personalData.nationality}
            onChange={handleChange}
          />
          {errors.nationality && (
            <Typography sx={{ color: palette.coral }} variant="caption">
              {errors.nationality}
            </Typography>
          )}
          


          <Typography sx={{ fontWeight: 600, color: palette.ink, mt: 2 }}>Country</Typography>
          <Dropdown
            label="Select Country"
            options={countries}
            value={selectedCountry}
            onChange={(e, value) => {
              setPersonalData((prev) => ({ ...prev, stateAndCity: "" }));
              handleSelectCountry(value);
            }}
            color={palette.teal}
          />
          {errors.country && (
            <Typography sx={{ color: palette.coral }} variant="caption">
              {errors.country}
            </Typography>
          )}
          {selectedCountry === "United States" && (
            <>
              <Typography sx={{ fontWeight: 600, color: palette.ink, mt: 2 }}>Work Authorization</Typography>
              <Dropdown
                label="Select Work Authorization"
                options={workAuthOptions}
                value={personalData.workAuthorization}
                onChange={handleDropdownChange("workAuthorization")}
                color={palette.teal}
              />
              {errors.workAuthorization && (
                <Typography sx={{ color: palette.coral }} variant="caption">
                  {errors.workAuthorization}
                </Typography>
              )}
            </>
          )}

          <Typography sx={{ fontWeight: 600, color: palette.ink, mt: 2 }}>State & City</Typography>
          <Dropdown
            label="Select State & City"
            options={stateAndCity}
            disabled={!selectedCountry}
            value={personalData.stateAndCity}
            onChange={handleDropdownChange("stateAndCity")}
            color={palette.teal}
          />
          {errors.stateAndCity && (
            <Typography sx={{ color: palette.coral }} variant="caption">
              {errors.stateAndCity}
            </Typography>
          )}

          <Typography sx={{ fontWeight: 600, color: palette.ink, mt: 2 }}>Pincode</Typography>
          <TextField
            fullWidth
            label="Pincode"
            name="pinCode"
            margin="dense"
            sx={dialogFieldSx}
            value={personalData.pinCode}
            onChange={handleChange}
          />
          {errors.pinCode && (
            <Typography sx={{ color: palette.coral }} variant="caption">
              {errors.pinCode}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderColor: palette.line, color: palette.ink, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: palette.teal, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: palette.tealDeep } }}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default React.memo(Personaldetails);

