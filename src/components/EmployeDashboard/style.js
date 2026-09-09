// import { styled } from "@mui/material/styles";
// import { makeStyles } from "@mui/styles";
// import { Box, Card, Chip } from "@mui/material";
// import { height } from "@mui/system";

// export const DashboardContainer = styled(Box)({
//   width: "100%",
//   padding: "20px 0px 20px 0px",
//   backgroundColor: "#f5f7fa",
//   maxWidth: "100%",
//   fontFamily: "Poppins, sans-serif",
// });

// export const Header = styled(Box)({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   marginBottom: "20px",
//   fontFamily: "Poppins, sans-serif",
// });

// export const StatCard = styled(Card)(({ bg }) => ({
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   padding: "20px",
//   backgroundColor: bg,
//   borderRadius: "8px",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// }));

// export const SectionCard = styled(Card)({
//   padding:15,
//   backgroundColor: '#fff',
//   borderRadius: '8px',
//   padding: '16px',
//   boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//   height:'319px'
// });

// export const JobItem = styled(Box)({
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   padding: "8px 0",
//   borderBottom: "1px solid #eee",
//   fontFamily: "Poppins, sans-serif",
// });

// export const StatusChip = styled(Chip)(({ color }) => ({
//   backgroundColor: color,
//   color: "#fff",
//   width: "100px",
//   height: "26px",
//   fontFamily: "Poppins, sans-serif",
// }));

// export const ChartContainer = styled(Card)({
//   padding: "10px",
//   backgroundColor: '#fff',
//   borderRadius: "16px",
//   boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//   fontFamily: "Poppins, sans-serif",
// });


// export const getDashboardStyles = makeStyles(() => ({
//   dashboard: {
//     padding: {xs: "0px", sm: "20px", md: "20px",lg:"20px" },
//     backgroundColor: "#f5f7fa",
//     maxWidth: "100%",
//     fontFamily: "Poppins, sans-serif",
//     position:"relative"

//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: "20px",
//     fontFamily: "Poppins, sans-serif",
//   },
//   title: {
//     fontSize: "24px",
//     fontWeight: "600",
//     color: "#333",
//     fontFamily: "Poppins, sans-serif",
//   },
//   charts: {
//     // height:"100px",
//     marginTop: "20px",
//     padding: "20px",
//     background: "#fff",
//     borderRadius: "16px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//     fontFamily: "Poppins, sans-serif",
//   },
//   dialogControls: {
//     display: "flex",
//     gap: "16px",
//     marginBottom: "16px",
//     fontFamily: "Poppins, sans-serif",
//   },
//   searchInput: {
//     flex: 1,
//     fontFamily: "Poppins, sans-serif",
//   },
//   sortSelect: {
//     minWidth: 150,
//     fontFamily: "Poppins, sans-serif",
//   },
//   candidateList: {
//   overflowY: 'auto',
//   fontFamily: 'Poppins, sans-serif',

//   maxHeight: '225px',
//     '&::-webkit-scrollbar': {
//       width: '4px', 
//     },
//     '&::-webkit-scrollbar-track': {
//       background: '#f1f1f1',
//       borderRadius: '4px',
//     },
//     '&::-webkit-scrollbar-thumb': {
//       background: '#6EB6FE',
//       borderRadius: '4px',
//     },
//     '&::-webkit-scrollbar-thumb:hover': {
//       background: '#5aa0e6', 
//     },
//   scrollbarWidth: 'thin',
//   scrollbarColor: '#6EB6FE #f1f1f1',
// },
// }));