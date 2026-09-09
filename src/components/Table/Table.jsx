import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Typography,
  MenuItem,
  IconButton,
  Select,
  FormControl,
  Tooltip,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

// ─── Design tokens (kept in sync with Mylist) ────────────────────────────────
const G = {
  cyan: "#00BCD4",
  cyanD: "#0097A7",
  cyanL: "#E0F7FA",
  border: "#EEF2F7",
  muted: "#9CA3AF",
  surface: "#F8FAFC",
  text: "#111827",
};

export default function ReusableMRT({
  data = [],
  enableRowSelection = false,
  enableRowActions = true,
  enableColumnFilters = true,
  enableGlobalFilter = true,
  onViewProfile,
  onSendEmail,
  enableRowClickModal = true,
  columnData = [],
  onRowClick,
  onDelete,
  height = "100%",
  // ── NEW: empty state props ─────────────────────────────────────────
  emptyStateIcon = "📭",
  emptyStateTitle = "No records available",
  emptyStateSubtitle = "Data will appear here once available.",
  ...rest
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // ─── Column definitions with consistent cell styling ──────────────────────
  const columns = useMemo(
    () =>
      columnData.map((col) => ({
        ...col,
        muiTableHeadCellProps: {
          sx: {
            fontSize: "11.5px",
            fontWeight: 700,
            color: "#6B7280",
            textTransform: "capitalize",
            letterSpacing: "0.6px",
            backgroundColor: G.surface,
            borderBottom: `2px solid ${G.border}`,
            py: "10px",
            px: "20px",
            whiteSpace: "nowrap",
            ...(col.headSx || {}),
          },
        },
        muiTableBodyCellProps: {
          sx: {
            fontSize: "13px",
            color: "#374151",
            fontWeight: 500,
            py: "12px",
            px: "20px",
            borderBottom: `1px solid ${G.border}`,
            ...(col.cellSx || {}),
          },
        },
      })),
    [columnData],
  );

  // ─── Table instance ───────────────────────────────────────────────────────
  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection,
    enableRowActions,
    enableColumnFilters,
    enableGlobalFilter,
    enableColumnActions: false,
    enableStickyHeader: true,
    renderBottomToolbar: false,
    renderTopToolbar: false,
// ── Empty state (keeps header/toolbar visible, only body changes) ─────
    renderEmptyRowsFallback: () => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2,
          width: "100%",
          minHeight: "calc(100vh - 320px)",
        }}
      >
        <Typography sx={{ fontSize: 34, lineHeight: 1, mb: 1 }}>
          {emptyStateIcon}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
          {emptyStateTitle}
        </Typography>
        <Typography sx={{ fontSize: 12.5, color: G.muted, mt: 0.5 }}>
          {emptyStateSubtitle}
        </Typography>
      </Box>
    ),
    // ── Scroll container ──────────────────────────────────────────────────
    muiTableContainerProps: {
      sx: {
        // fill all space between the sticky header and our custom footer
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "auto",
        "&::-webkit-scrollbar": { width: "5px", height: "7px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: `${G.cyan}66`, borderRadius: "6px" },
        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: G.cyan },
      },
    },

    // ── Actions column ────────────────────────────────────────────────────
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 56,
        header: "",
        muiTableHeadCellProps: {
          sx: {
            backgroundColor: G.surface,
            borderBottom: `2px solid ${G.border}`,
          },
        },
        muiTableBodyCellProps: {
          sx: { justifyContent: "center", px: 1 },
        },
      },
    },
    initialState: {
      showGlobalFilter: enableGlobalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
      columnPinning: {
        left: columnData.slice(0, 3).map(
          (col) => col.accessorKey || col.id
        ),
        right: [
          ...(enableRowActions ? ["mrt-row-actions"] : []),
          ...(columnData.some((c) => c.id === "actions")
            ? ["actions"]
            : []),
        ],
      },
    },

    columnFilterDisplayMode: "popover",

    // ── Paper / root ──────────────────────────────────────────────────────
    muiTablePaperProps: {
      sx: {
        backgroundColor: "#fff",
        boxShadow: "none",
        borderRadius: 0,
        // make the MRT root a flex column so our custom footer sticks
        display: "flex",
        flexDirection: "column",
        height: "100%",
      },
    },

    // ── Head ──────────────────────────────────────────────────────────────
    muiTableHeadProps: {
      sx: {
        "& tr:first-of-type th": { borderTop: "none" },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: G.surface,
        borderBottom: `2px solid ${G.border}`,
      },
    },

    // ── Body ──────────────────────────────────────────────────────────────
    muiTableBodyProps: { sx: { backgroundColor: "#fff" } },
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: "#fff",
        py: "12px",
        px: "20px",
        borderBottom: `1px solid ${G.border}`,
        fontSize: "13px",
      },
    },

    // ── Row interaction ───────────────────────────────────────────────────
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (onRowClick) {
          onRowClick(row.original);
          return;
        }
        if (enableRowClickModal) {
          setSelectedRow(row.original);
          setModalOpen(true);
        }
      },
      sx: {
        backgroundColor: "#ffffff !important",
        cursor: onRowClick || enableRowClickModal ? "pointer" : "default",
        transition: "background-color 0.12s",
        "&:hover td": {
          backgroundColor: `${G.cyanL} !important`,
        },
        "&:last-of-type td": {
          borderBottom: "none",
        },
      },
    }),

    // ── Bottom toolbar (disabled — we render our own footer below) ────────
    muiBottomToolbarProps: { sx: { display: "none" } },
    muiPaginationProps: { sx: { display: "none" } },

    // ── Row action menu ───────────────────────────────────────────────────
    renderRowActionMenuItems:
      enableRowActions &&
      (({ row, closeMenu }) => [
        <MenuItem
          key="delete"
          onClick={() => {
            onDelete?.(row.original);
            closeMenu();
          }}
          sx={{
            color: "#EF4444",
            gap: 1,
            fontSize: 13,
            "&:hover": { bgcolor: "#FEF2F2" },
          }}
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 17 }} />
          Delete
        </MenuItem>,
      ]),
  });

  const { getState, setPageIndex, setPageSize, getRowCount } = table;
  const { pagination } = getState();

  const totalPages = Math.ceil(getRowCount() / pagination.pageSize) || 1;
  const currentPage = pagination.pageIndex + 1;

  return (
    <Box
      sx={{
        height,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Table ── */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <MaterialReactTable table={table} {...rest} />
      </Box>

      {/* ══════════════════════════════════════════════════════════════
          CUSTOM FOOTER  — pinned at the bottom of every screen
      ══════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 0.9,
          bgcolor: "#fff",
          borderTop: `1px solid ${G.border}`,
          // subtle top shadow so it floats above the table
          boxShadow: "0 -2px 8px 0 rgba(0,0,0,0.04)",
          gap: 1.5,
          zIndex: 5,
        }}
      >
        {/* LEFT: record count */}
        <Typography sx={{ fontSize: 12, color: G.muted, fontWeight: 500 }}>
          Total{" "}
          <Box component="span" sx={{ fontWeight: 700, color: G.text }}>
            {data.length}
          </Box>{" "}
          records
        </Typography>

        {/* RIGHT: pagination controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Rows per page */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Typography sx={{ fontSize: 11.5, color: G.muted, whiteSpace: "nowrap" }}>
              Rows:
            </Typography>
            <Select
              value={pagination.pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageIndex(0);
              }}
              size="small"
              sx={{
                fontSize: "12px",
                height: 28,
                minWidth: 58,
                bgcolor: G.surface,
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: G.border },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: G.cyan },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: G.cyan },
                ".MuiSelect-select": { py: "2px" },
              }}
              MenuProps={{ PaperProps: { sx: { fontSize: "12px" } } }}
            >
              {[5, 10, 20, 25, 50, 100].map((n) => (
                <MenuItem key={n} value={n} sx={{ fontSize: "12px" }}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Divider */}
          <Box sx={{ width: 1, height: 20, bgcolor: G.border, mx: 0.5 }} />

          {/* First page */}
          <Tooltip title="First page" arrow>
            <span>
              <IconButton
                size="small"
                onClick={() => setPageIndex(0)}
                disabled={pagination.pageIndex === 0}
                sx={{
                  p: 0.5,
                  borderRadius: "7px",
                  color: pagination.pageIndex === 0 ? G.muted : G.cyanD,
                  "&:hover": { bgcolor: G.cyanL },
                  "&.Mui-disabled": { color: G.border },
                }}
              >
                <FirstPageIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </span>
          </Tooltip>

          {/* Previous page */}
          <Tooltip title="Previous page" arrow>
            <span>
              <IconButton
                size="small"
                onClick={() => setPageIndex(pagination.pageIndex - 1)}
                disabled={pagination.pageIndex === 0}
                sx={{
                  p: 0.5,
                  borderRadius: "7px",
                  color: pagination.pageIndex === 0 ? G.muted : G.cyanD,
                  "&:hover": { bgcolor: G.cyanL },
                  "&.Mui-disabled": { color: G.border },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </span>
          </Tooltip>

          {/* Page indicator */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              px: 1.2,
              py: 0.3,
              bgcolor: G.cyanL,
              borderRadius: "8px",
              border: `1px solid ${G.cyan}44`,
              minWidth: 72,
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: G.cyanD }}>
              {currentPage}
            </Typography>
            <Typography sx={{ fontSize: 12, color: G.muted, fontWeight: 400 }}>
              / {totalPages}
            </Typography>
          </Box>

          {/* Next page */}
          <Tooltip title="Next page" arrow>
            <span>
              <IconButton
                size="small"
                onClick={() => setPageIndex(pagination.pageIndex + 1)}
                disabled={(pagination.pageIndex + 1) * pagination.pageSize >= getRowCount()}
                sx={{
                  p: 0.5,
                  borderRadius: "7px",
                  color:
                    (pagination.pageIndex + 1) * pagination.pageSize >= getRowCount()
                      ? G.border
                      : G.cyanD,
                  "&:hover": { bgcolor: G.cyanL },
                  "&.Mui-disabled": { color: G.border },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </span>
          </Tooltip>

          {/* Last page */}
          <Tooltip title="Last page" arrow>
            <span>
              <IconButton
                size="small"
                onClick={() => setPageIndex(totalPages - 1)}
                disabled={(pagination.pageIndex + 1) * pagination.pageSize >= getRowCount()}
                sx={{
                  p: 0.5,
                  borderRadius: "7px",
                  color:
                    (pagination.pageIndex + 1) * pagination.pageSize >= getRowCount()
                      ? G.border
                      : G.cyanD,
                  "&:hover": { bgcolor: G.cyanL },
                  "&.Mui-disabled": { color: G.border },
                }}
              >
                <LastPageIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </span>
          </Tooltip>

          {/* Divider */}
          <Box sx={{ width: 1, height: 20, bgcolor: G.border, mx: 0.5 }} />

          {/* Range display */}
          <Typography sx={{ fontSize: 12, color: G.muted, whiteSpace: "nowrap" }}>
            <Box component="span" sx={{ fontWeight: 700, color: G.text }}>
              {pagination.pageIndex * pagination.pageSize + 1}–
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, getRowCount())}
            </Box>
            {" "}of{" "}
            <Box component="span" sx={{ fontWeight: 700, color: G.text }}>
              {getRowCount()}
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}