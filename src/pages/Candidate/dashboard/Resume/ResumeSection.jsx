import React, { useState, useCallback, useRef } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { useGetCandidateResumeQuery } from "../../../../store/api/settings/CandidatePortalApis";
import { candidateUpdateFormData } from "../../../../store/slices/candidateSlice";

const ACCENT = "#2B6F71";
const ACCENT_HOVER = "#1F5557";

function ResumeSection({ resumeInfo }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);
  const { data: resumeData } = useGetCandidateResumeQuery();

  // Extract resume info
  const resumeUrl = resumeData?.resume_url;

const resumeFileName = resumeUrl
  ? decodeURIComponent(
      resumeUrl.split("?")[0].split("/").pop()
    )
  : "No Resume Uploaded";
  // const uploadedDate = resume?.uploadedDate || resumeInfo?.uploaded_at || resumeData?.data?.uploaded_at || null;
const uploadedDate =
  resumeInfo?.uploaded_at || null;
  const hasResume = resumeFileName !== "No Resume Uploaded";

  const handleUploadClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (
        file.type === "application/pdf" ||
        file.type.startsWith("image/")
      ) {
        const newResume = {
          fileName: file.name,
          uploadedDate: new Date().toISOString(),
          fileUrl: URL.createObjectURL(file),
        };
        dispatch(candidateUpdateFormData({ section: "resume", updates: newResume }));
        setErrors({});
      } else {
        setErrors({ file: "Please select a PDF or image file" });
      }
      // reset so selecting the same file again still fires onChange
      e.target.value = "";
    },
    [dispatch],
  );

  const handleDelete = useCallback(() => {
    dispatch(candidateUpdateFormData({ section: "resume", updates: null }));
  }, [dispatch]);

  const handleDownload = useCallback(async () => {
    if (!resumeUrl) return;

    try {
      const response = await resumeData;
      const data = response?.data || response;
      if (data?.success && data?.resume_url) {
        window.open(data.resume_url, "_blank");
      } else {
        throw new Error("Resume URL not found in response");
      }
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert(
        "Error loading resume. Please check your connection or contact support.",
      );
    }
  }, [resumeUrl]);

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: 2,
        p: 2,
        mb: 2,
        boxShadow: 1,
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} fontSize={18} sx={{ mb: 2 }}>
        Resume
      </Typography>

      {/* ── File row: name / date on the left, download + delete on the right ── */}
      {hasResume && (
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          mb={1.5}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.4,
                color: "#2B6F71",
              }}
            >
              {resumeFileName}
            </Typography>
            {uploadedDate && (
              <Typography
                variant="caption"
                sx={{ color: "#878787", display: "block", lineHeight: 1.4, mt: 0 }}
              >
                Uploaded on{" "}
                {format(new Date(uploadedDate), "dd MMM yyyy")}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={handleDownload}
              disabled={!resumeUrl}
              sx={{
                bgcolor: "#F3F4F6",
                borderRadius: "8px",
                color: ACCENT,
                "&:hover": { bgcolor: "#E5E7EB" },
              }}
            >
              <FileDownloadOutlinedIcon fontSize="medium" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                bgcolor: "#F3F4F6",
                borderRadius: "8px",
                color: "error.main",
                "&:hover": { bgcolor: "#E5E7EB" },
              }}
            >
              <DeleteOutlineIcon fontSize="medium" />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* ── Dashed upload area ── */}
      <Paper
        variant="outlined"
        onClick={handleUploadClick}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: { xs: 3, sm: 4 },
          borderStyle: "dashed",
          borderColor: "#D1D5DB",
          borderRadius: 2,
          bgcolor: "#FAFAFA",
          cursor: "pointer",
        }}
      >
        <Box
          component="button"
          type="button"
          sx={{
            border: `1.5px solid ${ACCENT}`,
            color: ACCENT,
            bgcolor: "transparent",
            borderRadius: "999px",
            px: 3,
            py: 1,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            "&:hover": {
              bgcolor: ACCENT,
              color: "#fff",
              borderColor: ACCENT_HOVER,
            },
          }}
        >
          Upload Resume
        </Box>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
      </Paper>

      {errors.file && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
          {errors.file}
        </Typography>
      )}
    </Box>
  );
}

export default React.memo(ResumeSection);