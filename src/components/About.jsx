
// import React, { useEffect, useState } from 'react';
// import { Box, Button, Grid, Typography } from '@mui/material';
// import { ACCESS_TOKEN, getItem, IS_AUTHENTICATED, REFRESH_TOKEN, setItem, USER_TYPE } from './Utils/helper';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import _isEmpty from "lodash/isEmpty";
// import theme from '../styles/theme';

// function About() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [darkMode] = useState(false);

//   const isAuthenticated = () => {
//     return getItem(IS_AUTHENTICATED);
//   };

//   const isCandidateLogin = getItem(USER_TYPE) === "candidate";

//   // useEffect(() => {
//   //   if (searchParams.get("access_token")) {
//   //     const access_token = searchParams.get("access_token");
//   //     const refresh_token = searchParams.get("refresh_token");
//   //     if (access_token) {
//   //       setItem(ACCESS_TOKEN, access_token);
//   //       setItem(REFRESH_TOKEN, refresh_token);
//   //       setItem(USER_TYPE, "candidate");
//   //       const is_new_user = searchParams.get("is_new_user");
//   //       navigate("/for-candidate/register-details", { replace: true });

//   //       // if (is_new_user === "true") {
//   //       //   navigate("/for-candidate/register-details", { replace: true });
//   //       // } else {
//   //       //   setItem(IS_AUTHENTICATED, true);
//   //       //   // navigate("/for-candidate/candidate_dashboard", { replace: true });
//   //       //   navigate("/for-candidate/register-details", { replace: true });
//   //       // }
//   //     }
//   //   } else if (isAuthenticated()) {
//   //     if (isCandidateLogin) {
//   //       navigate("/for-candidate/candidate_dashboard", { replace: true });
//   //     } else {
//   //       navigate("/dashboard", { replace: true });
//   //     }
//   //   }
//   // }, [searchParams, navigate, isCandidateLogin]);

//   return (
//     <Box sx={{
//       background: `linear-gradient(to bottom right, rgba(3, 3, 90, 0.86), rgba(4, 155, 172, 0.97)), url("/images/about2.png")`,
//       backgroundSize: "cover", height: "100vh",
//       backgroundPosition: "center",
//     }}>
//       <Box
//         sx={{
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//           py: { xs: 2, sm: 3, lg: 4 },
//           overflowY: { lg: "hidden", xs: "auto" }
//         }}
//       >
//         {/*==================================== Headline ===========================================*/}
//         <Box sx={{ textAlign: "center", mt: { xs: 4, sm: 5, lg: 1, xl: 1 } }}>
//           <Typography
//             sx={{
//               // fontFamily: "Poppins",
//               font: "Poppins",
//               fontWeight: 500,
//               fontSize: { xs: "28px", sm: "32px", lg: "40px", xl: "50px" },
//               color: "white",
//               lineHeight: 1.2,
//             }}
//           >
//             Accelerate Your{" "}
//             <Box component="span" sx={{ font: "Poppins", color: "#66ccff", fontWeight: 600 }}>
//               Projects
//             </Box>
//           </Typography>
//           <Typography
//             sx={{
//               font: "Poppins",
//               // fontFamily: "Poppins",
//               fontWeight: 500,
//               fontSize: { xs: "28px", sm: "32px", lg: "40px", xl: "50px" },
//               color: "white",
//               lineHeight: 1.2,
//             }}
//           >
//             with Smart{" "}
//             <Box component="span" sx={{ font: "Poppins", color: "#66ccff", fontWeight: 600 }}>
//               Talent Matching
//             </Box>
//           </Typography>
//         </Box>

//         {/*===================================== Subheadline======================================== */}
//         <Box sx={{ textAlign: "center", mt: { xs: 2, sm: 3, lg: 3 } }}>
//           <Typography
//             sx={{
//               mt: "-15px",
//               font: "Poppins",
//               fontWeight: 400,
//               fontSize: { xs: "14px", sm: "16px", lg: "16px", xl: "20px" },
//               color: "white",
//               // lineHeight: 1.5,
//               maxWidth: { xs: "90%", sm: "600px", lg: "800px", xl: "900px" },
//               mx: "auto",
//             }}
//           >
//             If you are a Sponsor, CRO, or Clinical Site, our intelligent <br />
//             platform streamlines hiring with unmatched precision.
//           </Typography>
//         </Box>

//         {/*========================================= Cards =========================================== */}
//         <Grid
//           container
//           spacing={{ xs: 4, lg: 8 }}
//           sx={{
//             mt: { xs: 4, sm: 6, lg: 7, xl: 19 },
//             px: { xs: 1, sm: 2 },
//             justifyContent: "space-between",
//             width: "100%",
//           }}
//         >
//           {/* ======================================Left Card ==================================== */}
//           <Grid size={{ xs: 12, lg: 6 }} sx={{ ml: 0 }}>
//             <Box
//               sx={{
//                 backgroundColor: "white",
//                 borderBottomRightRadius: "53px",
//                 p: { xs: 4, lg: 3, lg: 4, xl: 6 },
//                 // fontFamily: "Poppins",
//                 fontWeight: 400,
//                 lineHeight: 1.5,
//                 width: "100%",
//                 boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                 height: { lg: "300px", xl: "340px" },
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//                 font: "Poppins",
//               }}
//             >
//               <Box>
//                 <Typography sx={{ fontSize: { xs: "16px", lg: "20px", xl: "24px" } }}>
//                   AI-Driven Candidate Matching Our proprietary
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: "16px", lg: "20px", xl: "24px" } }}>
//                   algorithms analyze experience, certifications,
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: "16px", lg: "20px", xl: "24px" } }}>
//                   therapeutic areas, and availability to ensure
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: "16px", lg: "20px", xl: "24px" } }}>
//                   perfect-fit candidates for every role.
//                 </Typography>
//               </Box>

//               <Button
//                 sx={{
//                   fontSize: "20px",
//                   padding: "4px 20px",
//                   borderRadius: "2px",
//                   color: "white",
//                   marginTop: "30px",
//                   font: "Poppins",
//                   width: "200px",
//                   bgcolor: `${theme.colors.cyan[200]} !important`,
//                   "&:hover": {
//                     bgcolor: `${theme.colors.cyan[200]} !important`,
//                   },
//                 }}
//                 variant='contained'
//                 onMouseOver={(e) => (e.target.style.backgroundColor = "#181E87")}
//                 onClick={() => navigate("/recruit")}
//               >
//                 For Companies
//               </Button>
//             </Box>
//           </Grid>

//           {/*=========================================== Right Card =======================================*/}
//           <Grid size={{ xs: 12, lg: 6, xl: 6 }} sx={{ mr: 0 }}>
//             <Box
//               sx={{
//                 backgroundColor: "white",
//                 borderTopLeftRadius: "53px",
//                 p: { xs: 4, lg: 3, lg: 4, xl: 5 },
//                 font: "Poppins",
//                 fontWeight: 400,
//                 lineHeight: 1.5,
//                 width: "100%",
//                 height: { lg: "300px", xl: "340px" },
//                 boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Box>
//                 <Typography sx={{
//                   font: "Poppins",
//                   fontSize: { xs: "16px", lg: "20px", xl: "24px" }
//                 }}>
//                   Advance Your Career with Precision Role
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: "16px", lg: "20px", xl: "24px" } }}>
//                   Matching Join a platform that understands
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: "16px", lg: "20px", xl: "24px" } }}>
//                   your skills, experience, and career goals. Our AI
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: "16px", lg: "20px", xl: "24px" } }}>
//                   technology connects you with clinical research
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: "16px", lg: "20px", xl: "24px" } }}>
//                   opportunities that truly fit—fast-track your next
//                 </Typography>
//                 <Typography sx={{ fontSize: { xs: "16px", lg: "20px", xl: "24px" } }}>
//                   role with confidence and clarity.
//                 </Typography>
//               </Box>

//               <Button
//                 sx={{
//                   padding: "4px 20px",
//                   fontSize: "20px",
//                   width: "200px",
//                   borderRadius: "2px",
//                   marginTop: "20px",
//                 }}
//                 variant='contained'
//                  onMouseOver={(e) => (e.target.style.backgroundColor = "#00acc1")}
//                 onMouseOut={(e) => (e.target.style.backgroundColor = "#181E87")}
//                 onClick={() => navigate("/for-candidate/candidate-home")}
//                //disabled={true}
//               >
//                 For Employees
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// }

// export default About;