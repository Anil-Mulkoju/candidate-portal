// import { Box, IconButton, Button } from "@mui/material";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// export default function CustomPagination({
//   page,
//   totalPages,
//   onPageChange,
// }) {
//   const getPages = () => {
//     if (totalPages <= 5) {
//       return Array.from({ length: totalPages }, (_, i) => i);
//     }

//     if (page <= 2) return [0, 1, 2, "...", totalPages - 1];
//     if (page >= totalPages - 3)
//       return [0, "...", totalPages - 3, totalPages - 2, totalPages - 1];

//     return [0, "...", page - 1, page, page + 1, "...", totalPages - 1];
//   };

//   return (
//     <Box display="flex" gap={1} alignItems="center" justifyContent="center">
//       <IconButton
//         disabled={page === 0}
//         onClick={() => onPageChange(page - 1)}
//       >
//         <ChevronLeftIcon />
//       </IconButton>

//       {getPages().map((p, i) =>
//         p === "..." ? (
//           <Button key={i} disabled>
//             ...
//           </Button>
//         ) : (
//           <Button
//             key={i}
//             variant={page === p ? "contained" : "outlined"}
//             onClick={() => onPageChange(p)}
//             sx={{
//               minWidth: 40,
//               height: 40,
//               borderRadius: 2,
//             }}
//           >
//             {p + 1}
//           </Button>
//         )
//       )}

//       <IconButton
//         disabled={page === totalPages - 1}
//         onClick={() => onPageChange(page + 1)}
//       >
//         <ChevronRightIcon />
//       </IconButton>
//     </Box>
//   );
// }
