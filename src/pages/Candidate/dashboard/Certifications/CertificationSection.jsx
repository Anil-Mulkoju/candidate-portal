import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import { useDispatch } from "react-redux";
import { format, isValid } from "date-fns";

import candidateApi from "../../../../services/candidateApi";
import { candidateUpdateFormData } from "../../../../store/slices/candidateSlice";
import { palette, fonts } from "../../../../theme/candidateTokens";

import {
  useGetCandidateCertificationsQuery,
} from "../../../../store/api/settings/CandidatePortalApis.js";


const dialogFieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: palette.line,
    },
    "&:hover fieldset": {
      borderColor: palette.teal,
    },
    "&.Mui-focused fieldset": {
      borderColor: palette.teal,
    },
  },
};


const DetailRow = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.25,
      mb: 1.4,
    }}
  >
    <Box
      sx={{
        color: palette.teal,
        display: "flex",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>

    <Typography
      sx={{
        fontSize: 12,
        color: palette.muted,
        width: 140,
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>

    <Typography
      sx={{
        fontSize: 13.5,
        color: palette.ink,
      }}
    >
      {value || "—"}
    </Typography>
  </Box>
);


function CertificationSection({
  certificationSelectionInfo,
  onSectionComplete,
}) {
  const dispatch = useDispatch();

  const [certifications, setCertifications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [certData, setCertData] = useState({
    id: null,
    name: "",
    organization: "",
    issueDate: "",
    expiryDate: "",
    file: null,
  });

  const [errors, setErrors] = useState({});


  // =========================================================
  // GET CERTIFICATIONS
  // =========================================================

  const {
    data: certificationsResponse,
    isLoading: certificationsLoading,
    isError: certificationsIsError,
    error: certificationsApiError,
    refetch: refetchCertifications,
  } = useGetCandidateCertificationsQuery();


  // =========================================================
  // MAP API DATA
  // =========================================================

  useEffect(() => {
    const certificationsData = certificationsResponse?.data || [];

    const mappedCertifications = certificationsData.map((cert) => ({
      id: cert.id,

      name: cert.certifications || "",

      organization: cert.certification_issued_by || "",

      issueDate: cert.certificate_issue_date || "",

      expiryDate: cert.certificate_expire_date || "",

      file: cert.certificate_url
        ? {
            name: cert.certificate_url.split("/").pop(),
            url: cert.certificate_url,
          }
        : null,
    }));

    setCertifications(mappedCertifications);

    dispatch(
      candidateUpdateFormData({
        section: "certifications",
        updates: mappedCertifications,
      })
    );

    if (onSectionComplete) {
      onSectionComplete(
        "certifications",
        mappedCertifications.length > 0
      );
    }
  }, [
    certificationsResponse,
    dispatch,
    onSectionComplete,
  ]);


  // =========================================================
  // API ERROR
  // =========================================================

  useEffect(() => {
    if (certificationsIsError) {
      const message =
        certificationsApiError?.data?.message ||
        certificationsApiError?.error ||
        "Failed to load certifications.";

      setError(message);
    } else {
      setError(null);
    }
  }, [
    certificationsIsError,
    certificationsApiError,
  ]);


  // =========================================================
  // OPEN ADD / EDIT DIALOG
  // =========================================================

  const handleOpen = (cert = null, index = null) => {
    setErrors({});
    setError(null);

    if (cert) {
      setCertData({
        id: cert.id || null,
        name: cert.name || "",
        organization: cert.organization || "",
        issueDate: cert.issueDate || "",
        expiryDate: cert.expiryDate || "",
        file: cert.file || null,
      });

      setEditingIndex(index);
    } else {
      setCertData({
        id: null,
        name: "",
        organization: "",
        issueDate: "",
        expiryDate: "",
        file: null,
      });

      setEditingIndex(null);
    }

    setOpen(true);
  };


  // =========================================================
  // CLOSE DIALOG
  // =========================================================

  const handleClose = () => {
    if (loading) return;

    setOpen(false);

    setCertData({
      id: null,
      name: "",
      organization: "",
      issueDate: "",
      expiryDate: "",
      file: null,
    });

    setErrors({});
    setEditingIndex(null);
  };


  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    if (name === "file") {
      setCertData((prev) => ({
        ...prev,
        file: files?.[0] || null,
      }));
    } else {
      setCertData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear field error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const tempErrors = {};

    if (!certData.name.trim()) {
      tempErrors.name = "Certification Name is required";
    }

    if (!certData.organization.trim()) {
      tempErrors.organization =
        "Issuing Organization is required";
    }

    if (!certData.issueDate) {
      tempErrors.issueDate = "Issue Date is required";
    }

    // Optional expiry date validation
    if (
      certData.expiryDate &&
      certData.issueDate &&
      new Date(certData.expiryDate) <
        new Date(certData.issueDate)
    ) {
      tempErrors.expiryDate =
        "Expiry Date cannot be before Issue Date";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };


  // =========================================================
  // FORMAT DATE FOR API
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "";

    try {
      const parsedDate = new Date(date);

      if (!isValid(parsedDate)) {
        return "";
      }

      return format(parsedDate, "dd/MM/yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };


  // =========================================================
  // SAVE / UPDATE CERTIFICATION
  // =========================================================

  const handleSubmit = async () => {
    setErrors({});

    if (!validate()) {
      return;
    }

    const formData = new FormData();

    formData.append(
      "certification_name",
      certData.name.trim()
    );

    formData.append(
      "certification_issued_by",
      certData.organization.trim()
    );

    formData.append(
      "certificate_issue_date",
      formatDate(certData.issueDate)
    );

    // Send expiry date only if selected
    if (certData.expiryDate) {
      formData.append(
        "certificate_expire_date",
        formatDate(certData.expiryDate)
      );
    }

    // Only append a real File object
    if (certData.file instanceof File) {
      formData.append(
        "certificate_file",
        certData.file
      );
    }

    try {
      setLoading(true);

      let response;

      // =====================================================
      // UPDATE
      // =====================================================

      if (
        editingIndex !== null &&
        certData.id
      ) {
        response = await candidateApi.put(
          `/candidates/update-certification/${certData.id}`,
          formData
        );
      }

      // =====================================================
      // ADD
      // =====================================================

      else {
        response = await candidateApi.post(
          "/candidates/add-certification",
          formData
        );
      }

      console.log(
        "Certification API response:",
        response?.data
      );

      // =====================================================
      // REFRESH GET API
      // =====================================================

      await refetchCertifications();

      handleClose();

    } catch (apiError) {
      console.error(
        "Error saving certification:",
        apiError
      );

      const message =
        apiError?.response?.data?.message ||
        apiError?.response?.data?.detail ||
        "Failed to save certification. Please try again.";

      setErrors({
        submit: message,
      });
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // DELETE CERTIFICATION
  // =========================================================

  const handleDelete = async (index) => {
    const certId = certifications[index]?.id;

    if (!certId) {
      setError(
        "Cannot delete certification: Invalid ID."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await candidateApi.delete(
        `/certifications/${certId}`
      );

      // Refresh data from backend
      await refetchCertifications();

    } catch (apiError) {
      console.error(
        "Error deleting certification:",
        apiError
      );

      const message =
        apiError?.response?.data?.message ||
        apiError?.response?.data?.detail ||
        "Failed to delete certification. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // DISPLAY DATE
  // =========================================================

  const displayDate = (date) => {
    if (!date) return "";

    try {
      const parsedDate = new Date(date);

      if (!isValid(parsedDate)) {
        return date;
      }

      return format(
        parsedDate,
        "MMM dd, yyyy"
      );
    } catch {
      return date;
    }
  };


  // =========================================================
  // LOADING STATE
  // =========================================================

  const isLoading =
    loading || certificationsLoading;


  // =========================================================
  // UI
  // =========================================================

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: palette.paper,
        border: `1px solid ${palette.line}`,
        borderRadius: "14px",
        p: {
          xs: 2.5,
          sm: 3,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1.5}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
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
            <WorkspacePremiumOutlinedIcon
              sx={{ fontSize: 18 }}
            />
          </Box>

          <Typography
            sx={{
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 17,
              color: palette.ink,
            }}
          >
            Certifications
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: palette.teal,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: palette.tealDeep,
            },
          }}
          onClick={() => handleOpen()}
          disabled={isLoading}
        >
          {certifications.length > 0
            ? "Add Another Certification"
            : "+ Add Certification"}
        </Button>
      </Box>


      {/* =====================================================
          LOADING
      ====================================================== */}

      {isLoading && (
        <Typography
          sx={{
            color: palette.muted,
            fontSize: 13.5,
            mt: 2,
          }}
        >
          Loading...
        </Typography>
      )}


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <Typography
          sx={{
            color: palette.coral,
            fontSize: 13.5,
            mt: 2,
          }}
        >
          {error}
        </Typography>
      )}


      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {certifications.length === 0 &&
      !isLoading ? (
        <Box
          textAlign="center"
          sx={{
            mt: 3,
            mb: 1,
          }}
        >
          <Typography
            sx={{
              color: palette.muted,
              fontSize: 13.5,
            }}
          >
            No certifications added yet.
          </Typography>

          <Button
            variant="text"
            sx={{
              color: palette.teal,
              textTransform: "none",
              fontWeight: 600,
              mt: 0.5,
            }}
            onClick={() => handleOpen()}
          >
            Add your first certification
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 2.5 }}>
          {certifications.map(
            (cert, index) => (
              <Box
                key={
                  cert.id ||
                  `certification-${index}`
                }
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-start",
                  py: 1.75,
                  borderBottom:
                    index <
                    certifications.length - 1
                      ? `1px solid ${palette.line}`
                      : "none",
                }}
              >
                {/* =========================================
                    CERTIFICATION DETAILS
                ========================================== */}

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily:
                        fonts.display,
                      fontWeight: 600,
                      fontSize: 14.5,
                      color: palette.ink,
                      mb: 1,
                    }}
                  >
                    {cert.name || "—"}
                  </Typography>

                  <DetailRow
                    icon={
                      <ApartmentOutlinedIcon
                        sx={{ fontSize: 18 }}
                      />
                    }
                    label="Issued By"
                    value={
                      cert.organization
                    }
                  />

                  <DetailRow
                    icon={
                      <EventOutlinedIcon
                        sx={{ fontSize: 18 }}
                      />
                    }
                    label="Issue Date"
                    value={displayDate(
                      cert.issueDate
                    )}
                  />

                  {cert.expiryDate && (
                    <DetailRow
                      icon={
                        <EventOutlinedIcon
                          sx={{ fontSize: 18 }}
                        />
                      }
                      label="Expiry Date"
                      value={displayDate(
                        cert.expiryDate
                      )}
                    />
                  )}

                  {cert.file && (
                    <DetailRow
                      icon={
                        <InsertDriveFileOutlinedIcon
                          sx={{ fontSize: 18 }}
                        />
                      }
                      label="File"
                      value={
                        cert.file.name
                      }
                    />
                  )}
                </Box>


                {/* =========================================
                    ACTION BUTTONS
                ========================================== */}

                <Box
                  sx={{
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  <IconButton
                    onClick={() =>
                      handleOpen(
                        cert,
                        index
                      )
                    }
                    aria-label="Edit certification"
                    disabled={isLoading}
                    sx={{
                      color: palette.teal,
                    }}
                  >
                    <EditIcon
                      sx={{
                        fontSize: 19,
                      }}
                    />
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      handleDelete(index)
                    }
                    aria-label="Delete certification"
                    disabled={isLoading}
                    sx={{
                      color: palette.coral,
                    }}
                  >
                    <DeleteOutlineIcon
                      sx={{
                        fontSize: 19,
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>
            )
          )}
        </Box>
      )}


      {/* =====================================================
          ADD / EDIT DIALOG
      ====================================================== */}

      <Dialog
        open={open}
        onClose={
          loading
            ? undefined
            : handleClose
        }
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "14px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: fonts.display,
            fontWeight: 600,
            color: palette.ink,
          }}
        >
          {editingIndex !== null
            ? "Edit Certification"
            : "Add Certification"}

          <IconButton
            onClick={handleClose}
            disabled={loading}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: palette.teal,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>


        <DialogContent dividers>
          {/* SUBMIT ERROR */}

          {errors.submit && (
            <Typography
              sx={{
                color: palette.coral,
                mb: 2,
              }}
              variant="body2"
            >
              {errors.submit}
            </Typography>
          )}


          {/* CERTIFICATION NAME */}

          <Typography
            sx={{
              fontWeight: 600,
              color: palette.ink,
              mt: 0.5,
            }}
          >
            Certification Name
          </Typography>

          <TextField
            fullWidth
            label="Certification Name"
            name="name"
            margin="dense"
            sx={dialogFieldSx}
            value={certData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />


          {/* ISSUING ORGANIZATION */}

          <Typography
            sx={{
              fontWeight: 600,
              color: palette.ink,
              mt: 2,
            }}
          >
            Issuing Organization
          </Typography>

          <TextField
            fullWidth
            label="Issuing Organization"
            name="organization"
            margin="dense"
            sx={dialogFieldSx}
            value={
              certData.organization
            }
            onChange={handleChange}
            error={
              !!errors.organization
            }
            helperText={
              errors.organization
            }
            required
          />


          {/* ISSUE DATE */}

          <Typography
            sx={{
              fontWeight: 600,
              color: palette.ink,
              mt: 2,
            }}
          >
            Issue Date
          </Typography>

          <TextField
            fullWidth
            type="date"
            label="Issue Date"
            name="issueDate"
            margin="dense"
            sx={dialogFieldSx}
            InputLabelProps={{
              shrink: true,
            }}
            value={
              certData.issueDate
            }
            onChange={handleChange}
            error={
              !!errors.issueDate
            }
            helperText={
              errors.issueDate
            }
            required
          />


          {/* EXPIRY DATE */}

          <Typography
            sx={{
              fontWeight: 600,
              color: palette.ink,
              mt: 2,
            }}
          >
            Expiry Date
            <Typography
              component="span"
              sx={{
                fontWeight: 400,
                color: palette.muted,
                ml: 0.5,
                fontSize: 12,
              }}
            >
              (Optional)
            </Typography>
          </Typography>

          <TextField
            fullWidth
            type="date"
            label="Expiry Date"
            name="expiryDate"
            margin="dense"
            sx={dialogFieldSx}
            InputLabelProps={{
              shrink: true,
            }}
            value={
              certData.expiryDate
            }
            onChange={handleChange}
            error={
              !!errors.expiryDate
            }
            helperText={
              errors.expiryDate
            }
          />


          {/* CERTIFICATE FILE */}

          <Typography
            sx={{
              fontWeight: 600,
              color: palette.ink,
              mt: 2,
              mb: 1,
            }}
          >
            Certificate
          </Typography>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            disabled={loading}
            sx={{
              borderColor: palette.line,
              color: palette.ink,
              textTransform: "none",
              "&:hover": {
                borderColor:
                  palette.teal,
                bgcolor:
                  palette.tealSoft,
              },
            }}
          >
            Upload Certificate
            {" "}
            (PDF/Image)

            <input
              type="file"
              name="file"
              hidden
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleChange}
            />
          </Button>


          {/* SELECTED FILE */}

          {certData.file && (
            <Typography
              sx={{
                mt: 1,
                color: palette.teal,
                fontSize: 13,
              }}
            >
              Selected:{" "}
              {certData.file.name}
            </Typography>
          )}
        </DialogContent>


        {/* ===================================================
            DIALOG ACTIONS
        ==================================================== */}

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            sx={{
              borderColor:
                palette.line,
              color: palette.ink,
              textTransform:
                "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              bgcolor: palette.teal,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor:
                  palette.tealDeep,
              },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingIndex !== null
              ? "Update"
              : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}


export default React.memo(
  CertificationSection
);