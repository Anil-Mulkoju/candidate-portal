
import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Chip,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const PRIMARY = "#2B6F71";
const PRIMARY_HOVER = "#1F5557";
const PRIMARY_LIGHT = "#D8ECEC";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#DDE1EA" },
    "&:hover fieldset": { borderColor: PRIMARY },
    "&.Mui-focused fieldset": { borderColor: PRIMARY },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: PRIMARY },
};

const radioSx = { color: PRIMARY, "&.Mui-checked": { color: PRIMARY } };

const autocompletePaperProps = {
  paper: {
    sx: {
      "& .MuiAutocomplete-option.Mui-focused": {
        backgroundColor: `${PRIMARY_LIGHT} !important`,
      },
      "& .MuiAutocomplete-option[aria-selected='true']": {
        backgroundColor: `${PRIMARY_LIGHT} !important`,
        color: PRIMARY_HOVER,
      },
    },
  },
};

const datePickerDaySx = {
  "&.MuiPickersDay-root.Mui-selected": {
    backgroundColor: PRIMARY,
    "&:hover, &:focus": { backgroundColor: PRIMARY_HOVER },
  },
  "&.MuiPickersDay-today": {
    borderColor: PRIMARY,
  },
};

const skillChipSx = {
  borderColor: PRIMARY,
  color: PRIMARY_HOVER,
  backgroundColor: "#fff",
  "& .MuiChip-deleteIcon": { color: PRIMARY },
  "& .MuiChip-deleteIcon:hover": { color: PRIMARY_HOVER },
};

// Your app saves dates as "yyyy/MM/dd" (see EmploymentForm.jsx: format(..., "yyyy/MM/dd")).
// Parse in that same order first, then fall back to a generic Date parse for any other shape.
const parseDate = (dateStr) => {
  if (!dateStr) return null;

  if (typeof dateStr === "string" && dateStr.includes("/")) {
    const [first, second, third] = dateStr.split("/");
    if (first && second && third) {
      // yyyy/MM/dd (matches what this app writes on save)
      if (first.length === 4) {
        const parsed = new Date(`${first}-${second}-${third}`);
        if (!isNaN(parsed.getTime())) return parsed;
      }
      // dd/MM/yyyy fallback, in case any legacy records use this shape
      const parsed = new Date(`${third}-${second}-${first}`);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  }

  const directParsed = new Date(dateStr);
  return isNaN(directParsed.getTime()) ? null : directParsed;
};

// Converts a rupee amount into an Indian-style words string, e.g.
// 400000 -> "Four Lakh rupees". Only used when currency === "₹".
const numberToWordsIndian = (num) => {
  const n = Math.floor(Number(num));
  if (!num || isNaN(n) || n === 0) return "";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
    "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  const twoDigits = (num) =>
    num < 20 ? ones[num] : tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");

  const threeDigits = (num) =>
    num < 100
      ? twoDigits(num)
      : ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + twoDigits(num % 100) : "");

  let result = "";
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;

  if (crore) result += threeDigits(crore) + " Crore ";
  if (lakh) result += threeDigits(lakh) + " Lakh ";
  if (thousand) result += threeDigits(thousand) + " Thousand ";
  if (rest) result += threeDigits(rest);

  return result.trim() + " rupees";
};

// ── API-shape helpers, mirroring EmploymentDetailsPage's parseNoticePeriod
// pattern ── these convert the descriptive labels this form's dropdowns
// show ("fresher", "2 Years", "15 Days or Less") into the numeric values a
// typical `total_exp_years` / `notice_period_days` field expects. This was
// the most likely source of the 422: those labels were previously sent to
// the API as raw strings.
// NOTE: the exact day-count mapping for notice period is inferred to match
// the style used elsewhere in this app — verify against your backend's
// actual accepted values before relying on it in production.
const parseTotalExpYears = (value) => {
  if (!value || value === "fresher") return 0;
  const match = String(value).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const parseTotalExpMonths = (value) => {
  if (!value) return 0;
  const match = String(value).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const parseNoticePeriodDaysLabel = (value) => {
  const map = {
    "15 Days or Less": 15,
    "1 Month": 30,
    "2 Months": 60,
    "3 Months": 90,
    "More then 3 Months": 91,
    "Serving Notice Period": 0,
  };
  return map[value] ?? null;
};

const AddEmployment = ({
  open,
  setOpen,
  handleSaveEmployment,
  editingData,
  editingIndex,
}) => {
  const [error, setError] = useState("");

  const initialState = {
    id: "",
    is_current: false,
    employment_type: "",
    total_exp_years: "",
    total_exp_months: "",
    overall_exp_years: "",
    overall_exp_months: "",
    company_name: "",
    job_title: "",
    joining_date: null,
    end_date: null,
    duration: "",
    currency: "₹",
    current_salary: "",
    salary_breakdown: "",
    fixed_salary: "",
    variable_salary: "",
    stock_types: [],
    skills_used: [],
    job_profile: "",
    country: "",
    location: "",
    notice_period_days: "",
    is_relevant: true,
    customSkill: "",
    previousEmployementType: "",
    previousCompany: "",
    previousJobTitle: "",
    previousJoiningDate: "",
    previousEndingDate: "",
    previousJobProfile: "",
  };

  const [localData, setLocalData] = useState(initialState);

  // ✅ String-based options (your request)
  const employmentTypes = ["PART TIME", "FULL TIME", "INTERNSHIP"];
  const salaryBreakdownList = ["Fixed", "Fixed + Variable", "Fixed + Variable + Stocks"];
  const stockTypeOptions = ["ESOPs", "SARs", "RSUs"];
  const currencyOptions = ["₹", "$", "€", "£", "¥", "AED", "AUD"];
  const totalYearsList = [
    "fresher",
    "1 Year",
    "2 Years",
    "3 Years",
    "4 Years",
    "5 Years",
  ];
  const noticePeriodDaysList = [
    "15 Days or Less",
    "1 Month",
    "2 Months",
    "3 Months",
    "More then 3 Months",
    "Serving Notice Period",
  ];
  const totalMonths = ["0 Month", "1 Month", "2 Months", "3 Months"];
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
    "Mapping/conversion ",
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

  const handleSkillsChange = (_e, value) => {
    setLocalData((prev) => ({
      ...prev,
      skills_used: value || [],
    }));
  };

  const handleCustomSkillAdd = (e) => {
    if (e.key === "Enter" && localData.customSkill.trim() !== "") {
      e.preventDefault();
      setLocalData((prev) => ({
        ...prev,
        skills_used: [...(prev.skills_used || []), prev.customSkill.trim()],
        customSkill: "",
      }));
    }
  };

  const handleFieldChange = (field) => (event) => {
    setLocalData({ ...localData, [field]: event.target.value });
  };

  const handleAutoCompleteChange = (field) => (event, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field) => (value) => {
    setLocalData({ ...localData, [field]: value });
  };

  const toggleStockType = (type) => {
    setLocalData((prev) => {
      const exists = prev.stock_types.includes(type);
      return {
        ...prev,
        stock_types: exists
          ? prev.stock_types.filter((t) => t !== type)
          : [...prev.stock_types, type],
      };
    });
  };

  const resetForm = () => {
    setLocalData(initialState);
    setError("");
  };

  // Builds the API-ready payload, matching the field set and types
  // EmploymentDetailsPage.buildPayload() sends: numeric experience,
  // dd/MM/yyyy dates, "present" for a current role's end_date, numeric
  // salary fields, and boolean flags — rather than the raw descriptive
  // labels this form's dropdowns display.
  const buildPayload = () => {
    const isCurrent = !!localData.is_current;

    const employmentType = isCurrent
      ? localData.employment_type
      : localData.previousEmployementType;
    const companyName = isCurrent
      ? localData.company_name
      : localData.previousCompany;
    const jobTitle = isCurrent
      ? localData.job_title
      : localData.previousJobTitle;
    const jobProfile = isCurrent
      ? localData.job_profile
      : localData.previousJobProfile;
    const joiningDateValue = isCurrent
      ? localData.joining_date
      : localData.previousJoiningDate;
    const endDateValue = isCurrent
      ? localData.end_date
      : localData.previousEndingDate;

    return {
      is_current: isCurrent,
      employment_type: employmentType || "",
      total_exp_years: parseTotalExpYears(localData.total_exp_years),
      total_exp_months: parseTotalExpMonths(localData.total_exp_months),
      company_name: companyName || "",
      job_title: jobTitle || "",
      joining_date: joiningDateValue
        ? format(new Date(joiningDateValue), "dd/MM/yyyy")
        : null,
      end_date: isCurrent
        ? "present"
        : endDateValue && !isNaN(new Date(endDateValue).getTime())
          ? format(new Date(endDateValue), "dd/MM/yyyy")
          : null,
      current_salary: Number(localData.current_salary) || 0,
      expected_salary: 0,
      fixed_salary: Number(localData.fixed_salary) || 0,
      variable_salary: Number(localData.variable_salary) || 0,
      type_of_stocks: (localData.stock_types || []).join(", "),
      value_of_stocks: 0,
      salary_breakdown: localData.salary_breakdown || "",
      skills_used: localData.skills_used || [],
      job_profile: jobProfile || "",
      country: localData.country || "",
      location: localData.location || "",
      key_responsibilities: "",
      notice_period_days: parseNoticePeriodDaysLabel(localData.notice_period_days),
      duration: localData.duration || "",
      is_relevant: !!localData.is_relevant,
      willing_to_relocate: false,
    };
  };

  // FIX: `handleSave` used to call `resetForm()` immediately and synchronously,
  // right after firing the (async) save to the parent. That wiped the form
  // to blank before the parent's update/GET-refresh cycle ever completed —
  // on failure it discarded the user's edits, and even on success it caused
  // a visible flash of blank/incorrect data before the dialog closed.
  //
  // The `useEffect` below (keyed on `editingData` + `open`) is what should own
  // resetting/repopulating the form. It fires whenever the parent updates
  // `editingData` or toggles `open`, so there's no need to reset manually here.
  //
  // NOTE: this now passes the built API-ready payload as the first argument
  // (previously it passed the raw form-shaped `localData`). If the parent's
  // handleSaveEmployment expects the old raw shape — e.g. to look up
  // editingIndex or read UI-only fields — it will need updating to match
  // this new (payload, rawFormState) signature. The raw state is still
  // passed as a second argument for that purpose.
  const handleSave = () => {
    setError("");
    const payload = buildPayload();
    handleSaveEmployment?.(payload, localData);
    // no resetForm() here — parent flips `open`/`editingData` when the
    // save (and refetch) actually finishes, and the effect below handles it
  };

  useEffect(() => {
    if (editingData) {
      setLocalData({
        id: editingData.id || "",
        // FIX: normalize to a strict boolean. Previously this stored whatever
        // raw truthy value the API returned, but the RadioGroup below checks
        // `=== true`, so anything other than the literal boolean `true` was
        // silently rendered as "No".
        is_current: !!editingData.is_current,
        employment_type: editingData.employment_type || "",
        total_exp_years: editingData.total_exp_years?.toString() || "",
        total_exp_months: editingData.total_exp_months?.toString() || "",
        overall_exp_years: editingData.overall_exp_years?.toString() || "",
        overall_exp_months: editingData.overall_exp_months?.toString() || "",
        company_name: editingData.company_name || "",
        job_title: editingData.job_title || "",
        joining_date: parseDate(editingData.joining_date),
        end_date: parseDate(editingData.end_date),
        duration: editingData.duration || "",
        currency: editingData.currency || "₹",
        current_salary: editingData.current_salary?.toString() || "",
        salary_breakdown: editingData.salary_breakdown || "",
        fixed_salary: editingData.fixed_salary?.toString() || "",
        variable_salary: editingData.variable_salary?.toString() || "",
        stock_types: Array.isArray(editingData.stock_types)
          ? editingData.stock_types
          : typeof editingData.stock_types === "string"
          ? editingData.stock_types.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        skills_used: Array.isArray(editingData.skills_used)
          ? editingData.skills_used
          : typeof editingData.skills_used === "string"
          ? editingData.skills_used.split(",").map((s) => s.trim())
          : [],
        job_profile: editingData.job_profile || "",
        country: editingData.country || "",
        location: editingData.location || "",
        notice_period_days: editingData.notice_period_days?.toString() || "",
        is_relevant: editingData.is_relevant ?? true,
        customSkill: "",
        previousEmployementType: editingData.employment_type || "",
        previousCompany: editingData.company_name || "",
        previousJobTitle: editingData.job_title || "",
        previousJoiningDate: parseDate(editingData.joining_date),
        previousEndingDate: parseDate(editingData.end_date),
        previousJobProfile: editingData.job_profile || "",
      });
    } else {
      setLocalData(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingData, open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        resetForm();
      }}
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
          background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_HOVER})`,
          color: "#fff",
          py: 2.5,
          px: 3,
          fontWeight: 600,
          position: "relative",
        }}
      >
        {editingIndex !== null ? "Edit Employment" : "Add Employment"}
        <CloseIcon
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", right: 20, top: 20, cursor: "pointer" }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 3, paddingTop: 4 }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Typography sx={{ mb: 0, fontSize: "13px" }}>
          Is This Your Current Employement ?
        </Typography>
        {/* Current / Previous Employment */}
        <RadioGroup
          row
          value={localData.is_current === true ? "yes" : "no"}
          onChange={(e) => {
            const newValue = e.target.value === "yes"; // convert back to boolean
            setLocalData({ ...localData, is_current: newValue });
          }}
        >
          <FormControlLabel
            value="yes"
            control={<Radio sx={radioSx} />}
            label="Yes"
          />
          <FormControlLabel
            value="no"
            control={<Radio sx={radioSx} />}
            label="No"
          />
        </RadioGroup>

        <Typography sx={{ mb: 0, fontSize: "13px" }}>
          Is This Relevant Experience ?
        </Typography>
        {/* Current / Previous Employment */}
        <RadioGroup
          row
          value={localData.is_relevant === true ? "yes" : "no"}
          onChange={(e) => {
            const newValue = e.target.value === "yes"; // convert back to boolean
            setLocalData({ ...localData, is_relevant: newValue });
          }}
        >
          <FormControlLabel
            value="yes"
            control={<Radio sx={radioSx} />}
            label="Yes"
          />
          <FormControlLabel
            value="no"
            control={<Radio sx={radioSx} />}
            label="No"
          />
        </RadioGroup>

        {/* Total Experience */}

        {localData?.is_current ? (
          <Box>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Autocomplete
                options={totalYearsList}
                value={localData.total_exp_years || ""}
                onChange={handleAutoCompleteChange("total_exp_years")}
                sx={{ flex: 1 }}
                componentsProps={autocompletePaperProps}
                renderInput={(params) => (
                  <TextField {...params} label="Experience In Years" sx={fieldSx} />
                )}
              />
              <Autocomplete
                options={totalMonths}
                value={localData.total_exp_months || ""}
                onChange={handleAutoCompleteChange("total_exp_months")}
                sx={{ flex: 1 }}
                componentsProps={autocompletePaperProps}
                renderInput={(params) => (
                  <TextField {...params} label="Experience In Months" sx={fieldSx} />
                )}
              />
            </Box>
            {/* Employment Type */}
            <Box sx={{ mt: 1 }}>
              <Autocomplete
                options={employmentTypes}
                value={localData.employment_type || ""}
                onChange={handleAutoCompleteChange("employment_type")}
                componentsProps={autocompletePaperProps}
                renderInput={(params) => (
                  <TextField {...params} label="Employment Type" sx={fieldSx} />
                )}
              />
            </Box>

            {/* Job Title + Company Name */}
            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Job Title"
                fullWidth
                value={localData.job_title}
                onChange={handleFieldChange("job_title")}
                sx={fieldSx}
              />
              <TextField
                label="Company Name"
                fullWidth
                value={localData.company_name}
                onChange={handleFieldChange("company_name")}
                sx={fieldSx}
              />
            </Box>

            {/* Start / End Date */}
            <Box display="flex" gap={2} mt={2}>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      sx={{ mt: -1, ...fieldSx }}
      label="Start Date"
      value={localData.joining_date || null}
      onChange={(value) => {
        setLocalData((prev) => ({
          ...prev,
          joining_date: value,
          // clear end date if it's now before the new start date
          end_date:
            prev.end_date && value && new Date(prev.end_date) < new Date(value)
              ? null
              : prev.end_date,
        }));
      }}
      maxDate={localData.end_date ? new Date(localData.end_date) : undefined}
      slots={{ textField: TextField }}
      slotProps={{
        textField: { size: "medium", fullWidth: true },
        popper: {
          modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
          sx: { zIndex: 1300, backgroundColor: "white" },
        },
        day: { sx: datePickerDaySx },
      }}
    />
  </LocalizationProvider>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      sx={{ mt: -1, ...fieldSx }}
      label="End Date"
      value={localData.end_date || null}
      onChange={handleDateChange("end_date")}
      disabled={localData.is_current}
      minDate={localData.joining_date ? new Date(localData.joining_date) : undefined}
      slots={{ textField: TextField }}
      slotProps={{
        textField: { size: "medium", fullWidth: true },
        popper: {
          modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
          sx: { zIndex: 1300, backgroundColor: "white" },
        },
        day: { sx: datePickerDaySx },
      }}
    />
  </LocalizationProvider>
</Box>

            {/* Salary */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Autocomplete
                options={currencyOptions}
                value={localData.currency || "₹"}
                onChange={handleAutoCompleteChange("currency")}
                disableClearable
                sx={{ width: 120 }}
                componentsProps={autocompletePaperProps}
                renderInput={(params) => (
                  <TextField {...params} label="Currency" sx={fieldSx} />
                )}
              />
              <TextField
                label="Current Salary"
                fullWidth
                value={localData.current_salary}
                onChange={handleFieldChange("current_salary")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {localData.currency || "₹"}
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
            </Box>
            {localData.currency === "₹" && localData.current_salary && (
              <Typography sx={{ mt: 0.5, ml: 0.5, fontSize: "12.5px", color: "#2e7d32" }}>
                {numberToWordsIndian(localData.current_salary)}
              </Typography>
            )}

            {/* Salary Breakdown */}
            <Box sx={{ mt: 2 }}>
              <Autocomplete
                options={salaryBreakdownList}
                value={localData.salary_breakdown || ""}
                onChange={(e, value) =>
                  setLocalData((prev) => ({
                    ...prev,
                    salary_breakdown: value,
                    // reset dependent fields whenever the breakdown type changes
                    fixed_salary: value === "Fixed" ? "" : prev.fixed_salary,
                    variable_salary: value === "Fixed" ? "" : prev.variable_salary,
                    stock_types:
                      value === "Fixed + Variable + Stocks" ? prev.stock_types : [],
                  }))
                }
                componentsProps={autocompletePaperProps}
                renderInput={(params) => (
                  <TextField {...params} label="Salary Breakdown" sx={fieldSx} />
                )}
              />
              {localData.salary_breakdown === "Fixed" && (
                <Typography sx={{ mt: 0.5, ml: 0.5, fontSize: "12.5px", color: "#2e7d32" }}>
                  Your total salary has been considered as fixed component
                </Typography>
              )}
            </Box>

            {(localData.salary_breakdown === "Fixed + Variable" ||
              localData.salary_breakdown === "Fixed + Variable + Stocks") && (
              <Box display="flex" gap={2} mt={2}>
                <TextField
                  label="Fixed Salary"
                  fullWidth
                  value={localData.fixed_salary}
                  onChange={handleFieldChange("fixed_salary")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {localData.currency || "₹"}
                      </InputAdornment>
                    ),
                  }}
                  sx={fieldSx}
                />
                <TextField
                  label="Variable Salary"
                  fullWidth
                  placeholder="Eg. 45,765"
                  value={localData.variable_salary}
                  onChange={handleFieldChange("variable_salary")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {localData.currency || "₹"}
                      </InputAdornment>
                    ),
                  }}
                  sx={fieldSx}
                />
              </Box>
            )}

            {localData.salary_breakdown === "Fixed + Variable + Stocks" && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ mb: 1, fontSize: "13px", fontWeight: 600 }}>
                  Type of stocks
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {stockTypeOptions.map((type) => {
                    const selected = localData.stock_types.includes(type);
                    return (
                      <Chip
                        key={type}
                        label={type}
                        onClick={() => toggleStockType(type)}
                        variant={selected ? "filled" : "outlined"}
                        sx={{
                          borderColor: PRIMARY,
                          color: selected ? "#fff" : PRIMARY_HOVER,
                          backgroundColor: selected ? PRIMARY : "#fff",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: selected ? PRIMARY_HOVER : PRIMARY_LIGHT,
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Job Profile + Country */}
            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Job Profile"
                fullWidth
                value={localData.job_profile}
                onChange={handleFieldChange("job_profile")}
                sx={fieldSx}
              />
              <TextField
                label="Country"
                fullWidth
                value={localData.country}
                onChange={handleFieldChange("country")}
                sx={fieldSx}
              />
            </Box>

            {/* Location + Notice Period */}
            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Location"
                fullWidth
                value={localData.location}
                onChange={handleFieldChange("location")}
                sx={{ flex: 1, ...fieldSx }}
              />
              <Autocomplete
                options={noticePeriodDaysList}
                value={localData.notice_period_days}
                onChange={handleAutoCompleteChange("notice_period_days")}
                sx={{ flex: 1 }}
                componentsProps={autocompletePaperProps}
                renderInput={(params) => (
                  <TextField {...params} label="Notice Period (Days)" sx={fieldSx} />
                )}
              />
            </Box>

            {/* Duration */}
            <TextField
              label="Duration"
              fullWidth
              sx={{ mt: 2, ...fieldSx }}
              value={localData.duration}
              onChange={handleFieldChange("duration")}
            />

            {/* Skills Used */}
            <Box sx={{ mt: 2 }}>
              <Autocomplete
                multiple
                freeSolo
                options={availableSkills}
                value={localData.skills_used || []}
                onChange={handleSkillsChange}
                getOptionLabel={(option) => option || ""}
                componentsProps={autocompletePaperProps}
                ChipProps={{ variant: "outlined", sx: skillChipSx }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tech Skills"
                    placeholder="Type to add custom skills or select from list"
                    onKeyDown={handleCustomSkillAdd}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: PRIMARY },
                        "&:hover fieldset": { borderColor: PRIMARY },
                        "&.Mui-focused fieldset": { borderColor: PRIMARY },
                        "& .MuiInputBase-input": {
                          height: "20px",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: PRIMARY },
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ mt: 1 }}>
              <Autocomplete
                options={employmentTypes}
                value={localData.previousEmployementType || ""}
                onChange={handleAutoCompleteChange("previousEmployementType")}
                componentsProps={autocompletePaperProps}
                renderInput={(params) => (
                  <TextField {...params} label="Employment Type" sx={fieldSx} />
                )}
              />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Previous Company Name"
                fullWidth
                value={localData.previousCompany}
                onChange={handleFieldChange("previousCompany")}
                sx={fieldSx}
              />
              <TextField
                label="Previous Job Title"
                fullWidth
                value={localData.previousJobTitle}
                onChange={handleFieldChange("previousJobTitle")}
                sx={fieldSx}
              />
            </Box>

            {/* Start / End Date */}
            <Box display="flex" gap={2} mt={2}>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      sx={{ mt: -1, ...fieldSx }}
      label="Joining Date"
      value={localData.previousJoiningDate || null}
      onChange={(value) => {
        setLocalData((prev) => ({
          ...prev,
          previousJoiningDate: value,
          previousEndingDate:
            prev.previousEndingDate && value && new Date(prev.previousEndingDate) < new Date(value)
              ? null
              : prev.previousEndingDate,
        }));
      }}
      maxDate={localData.previousEndingDate ? new Date(localData.previousEndingDate) : undefined}
      slots={{ textField: TextField }}
      slotProps={{
        textField: { size: "medium", fullWidth: true },
        popper: {
          modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
          sx: { zIndex: 1300, backgroundColor: "white" },
        },
        day: { sx: datePickerDaySx },
      }}
    />
  </LocalizationProvider>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      sx={{ mt: -1, ...fieldSx }}
      label="Ending Date"
      value={localData.previousEndingDate || null}
      onChange={handleDateChange("previousEndingDate")}
      disabled={localData.isEmployed === "yes"}
      minDate={localData.previousJoiningDate ? new Date(localData.previousJoiningDate) : undefined}
      slots={{ textField: TextField }}
      slotProps={{
        textField: { size: "medium", fullWidth: true },
        popper: {
          modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
          sx: { zIndex: 1300, backgroundColor: "white" },
        },
        day: { sx: datePickerDaySx },
      }}
    />
  </LocalizationProvider>
</Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Job Profile"
                fullWidth
                value={localData.previousJobProfile}
                onChange={handleFieldChange("previousJobProfile")}
                sx={fieldSx}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #f0f0f0" }}>
        <Button
          onClick={() => setOpen(false)}
          variant="outlined"
          sx={{ borderRadius: "10px", px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_HOVER})`,
            color: "#fff",
            borderRadius: "10px",
            px: 4,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              background: `linear-gradient(135deg, ${PRIMARY_HOVER}, ${PRIMARY_HOVER})`,
            },
          }}
        >
          {editingIndex !== null ? "Save Changes" : "Add Employment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployment;
