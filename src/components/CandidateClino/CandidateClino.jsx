// import React, { useContext, useState, useEffect, memo } from "react";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import { Typography, Button, CardActions } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import { AppContext } from "../../AppContext";
// import {
//   fetchCandidateDetails,
//   fetchMatchingCandidates,
// } from "../../actions/candidate";
// import _isArray from "lodash/isArray";
// import CandidateCard from "../HMDashoard/CandidateCard";
// import { fetchCandidateDashboardDetails } from "../../actions/jobDetails";
// import { ACCESS_TOKEN, getItem } from "../Utils/helper";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Tooltip,
//   useMap,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useTheme, useMediaQuery } from "@mui/material";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// const leafletTooltipStyle = `
//   .leaflet-tooltip.custom-tooltip {
//     background-color: white !important;
//     border: 1px solid #ccc !important;
//     padding: 8px !important;
//     box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
//     display: flex !important;
//     flex-direction: row !important;
//     pointer-events: auto !important;
//     z-index: 1000 !important;
//   }
// `;
// const styleSheet = document.createElement("style");
// styleSheet.innerText = leafletTooltipStyle;
// document.head.appendChild(styleSheet);

// const truncateDesignation = (designation, maxLength = 30) => {
//   if (!designation) return "Not Specified";
//   return designation.length > maxLength
//     ? `${designation.slice(0, maxLength)}...`
//     : designation;
// };

// // Set map center only on initial load
// const MapAutoCenter = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center);
//     }
//   }, []);
//   return null;
// };

// const CandidateClino = memo(() => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { setLoading } = useContext(AppContext);
//   const job_details_id = location.state?.job_details_id || "";
//   console.log("location.state", job_details_id);

//   const { shortlistedId, list = [] } = location.state || {};
//   const [agreementData, setAgreementData] = useState([]);
//   const [viewMode, setViewMode] = useState("tile");
//   const [openTooltipId, setOpenTooltipId] = useState(null);
//   const theme = useTheme();
//   const isXs = useMediaQuery(theme.breakpoints.only("xs"));
//   const isSm = useMediaQuery(theme.breakpoints.only("sm"));
//   const isLg = useMediaQuery(theme.breakpoints.only("lg"));
//   const isXl = useMediaQuery(theme.breakpoints.only("xl"));

//   useEffect(() => {
//   if (job_details_id) {
//     getCandidates();
//   } else if (_isArray(list) && list.length > 0) {
//     setAgreementData(list.slice(0, 3));
//   }
// }, [job_details_id, shortlistedId]);


//   const getCandidates = async () => {
//     const responseData = await fetchMatchingCandidates(
//       job_details_id,
//       setLoading
//     );
//     if (_isArray(responseData) && responseData.length > 0) {
//       setAgreementData(responseData.slice(0, 3));
//     }
//   };

//   const handleClickInterview = async (candidates_id) => {
//     const candidateData = await fetchCandidateDetails(
//       candidates_id,
//       setLoading
//     );
//     if (candidateData) {
//       navigate("/recruit/dashboard/profile-details", {
//         state: { profileResponse: candidateData, list: agreementData },
//       });
//     }
//   };

//   const handleClickDashboard = async () => {
//     const token = getItem(ACCESS_TOKEN);
//     const dashboardData = await fetchCandidateDashboardDetails(
//       setLoading,
//       "open",
//       token
//     );
//     if (dashboardData) {
//       navigate("/recruit/dashboard/jobs", {
//         state: { jobData: dashboardData },
//       });
//     }
//   };

//   // Group candidates by coordinates
//   const groupedCandidates = agreementData.reduce((acc, candidate) => {
//     const lat = parseFloat(candidate.latitude) || 20.5937 || 38.7946;
//     const lng = parseFloat(candidate.longitude) || 60.9629 || 90.5348;
//     const key = `${lat},${lng}`;
//     if (!acc[key]) {
//       acc[key] = {
//         coords: [lat, lng],
//         city: candidate.location || "Unknown Location",
//         candidates: [],
//       };
//     }
//     acc[key].candidates.push({
//       ...candidate,
//       clinIQ: `Skillintel ${candidate.match_score}%`,
//       clinScore: "Not Assessed",
//       candidateName: candidate.candidate_name,
//       experience: candidate.total_experience,
//       availability:
//         candidate.availability === "0"
//           ? "Immediately available"
//           : `Available in ${candidate.availability} days`,
//       city: candidate.location || "Unknown Location",
//       designation: truncateDesignation(candidate.designation),
//     });
//     return acc;
//   }, {});

//   const assignedCandidates = Object.values(groupedCandidates);

//   const defaultCenter = [20.5937, 70.9629];
//   const mapCenter = assignedCandidates.length
//     ? assignedCandidates[0].coords
//     : defaultCenter;

//   const getCardSize = (count) => {
//     if (count === 1) {
//       if (isXs) return { width: 198, height: "auto" };
//       if (isSm) return { width: 230, height: "auto" };
//       if (isLg) return { width: 265, height: "auto" };
//       if (isXl) return { width: 327, height: "auto" };
//       return { width: 400, height: "auto" };
//     }
//     if (count === 2) {
//       if (isXs) return { width: "98vw", height: "auto" };
//       if (isSm) return { width: 250, height: "auto" };
//       if (isLg) return { width: 280, height: "auto" };
//       if (isXl) return { width: 340, height: "auto" };
//       return { width: 320, height: "auto" };
//     }
//     if (isXs) return { width: "98vw", height: "auto" };
//     if (isSm) return { width: 240, height: "auto" };
//     if (isLg) return { width: 280, height: "auto" };
//     if (isXl) return { width: 345, height: "auto" };
//     return { width: 280, height: "auto" };
//   };

//   const getMapHeight = () => {
//     if (isXs) return "55vh";
//     if (isSm) return "90vh";
//     if (isLg) return "88vh";
//     if (isXl) return "92vh";
//     return "70vh";
//   };

//   return (
//     <Box
//       sx={{
//         flexGrow: 1,
//         position: "relative",
//         width: "100%",
//         minHeight: "calc(100vh - 64px)",
//         overflow: "auto",
//       }}
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: 17,
//           right: 8,
//           zIndex: 1000,
//           display: "flex",
//           gap: 1,
//         }}
//       >
//         <Button
//           variant={viewMode === "tile" ? "contained" : "outlined"}
//           color="primary"
//           onClick={() => setViewMode("tile")}
//         >
//           Tile View
//         </Button>
//         <Button
//           variant={viewMode === "map" ? "contained" : "outlined"}
//           color="primary"
//           onClick={() => setViewMode("map")}
//         >
//           Map View
//         </Button>
//       </Box>

//       {viewMode === "tile" ? (
//         <Grid
//           container
//           justifyContent="center"
//           spacing={{ xs: 2, sm: 3, lg: 3, xl: 4 }}
//           sx={{ mt: { xs: 2, sm: 5, lg: 10, xl: 12 } }}
//         >
//           {agreementData.length > 0 ? (
//             agreementData.map((candidate, idx) => {
//               const { width, height } = getCardSize(agreementData.length);
//               return (
//                 <Grid
//                   item
//                   key={candidate.id}
//                   size={{
//                     xs: 12,
//                     sm: agreementData.length === 1 ? 12 : 6,
//                     lg: agreementData.length === 1 ? 6 : 3,
//                     xl: agreementData.length === 1 ? 4 : 3,
//                   }}
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "stretch",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width,
//                       height,
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "stretch",
//                     }}
//                   >
//                     <CandidateCard
//                       style={{ height: "100%" }}
//                       candidate={{
//                         ...candidate,
//                         clinIQ: `Skillintel\u00A0\u00A0\u00A0\u00A0\u00A0 ${candidate.match_score}%`,
//                         clinScore: "Not Assessed",
//                         candidateName: candidate.candidate_name,
//                         experience: candidate.total_experience,
//                         availability:
//                           candidate.availability === "0"
//                             ? "Immediately available"
//                             : `Available in ${candidate.availability} days`,
//                       }}
//                       index={idx}
//                       total={agreementData.length}
//                     >
//                       <CardActions
//                         sx={{
//                           width: "100%",
//                           display: "flex",
//                           justifyContent: "center",
//                         }}
//                       >
//                         {candidate.status === "shortlisted" ? (
//                           <Box display="flex" flexDirection="column" gap={1}>
//                             <Button variant="text" color="secondary" disabled>
//                               Shortlisted
//                             </Button>
//                             <Button
//                               variant="outlined"
//                               color="primary"
//                               onClick={handleClickDashboard}
//                             >
//                               Job 
//                               Dashboard
//                             </Button>
//                             <Button
//                               variant="contained"
//                               sx={{
//                                         backgroundColor: "#00bbd4",
//                                         color: "#fff",
//                                         "&:hover": {
//                                           backgroundColor: "#00D0F7",
//                                         },
//                                       }}
//                               onClick={() => handleClickInterview(candidate.id)}
//                             >
//                               View Profile
//                             </Button>
//                           </Box>
//                         ) : (
//                           <Button
//                             variant="contained"
//                             sx={{
//                               backgroundColor: "#00bbd4",
//                               color: "#fff",
//                               "&:hover": { backgroundColor: "#00D0F7" },
//                             }}
//                             onClick={() => handleClickInterview(candidate.id)}
//                           >
//                             View Profile
//                           </Button>
//                         )}
//                       </CardActions>
//                     </CandidateCard>
//                   </Box>
//                 </Grid>
//               );
//             })
//           ) : (
//             <Typography
//               variant="h6"
//               color="text.secondary"
//               sx={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//               }}
//             >
//               No candidates found.
//             </Typography>
//           )}
//         </Grid>
//       ) : (
//         <Box
//           sx={{
//             width: "100%",
//             height: getMapHeight(),
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           {assignedCandidates.length > 0 ? (
//             <MapContainer
//               center={mapCenter}
//               zoom={4}
//               style={{ height: "100%", width: "100%" }}
//               doubleClickZoom={false}
//               boxZoom={false}
//             >
//               <MapAutoCenter center={mapCenter} />
//               <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />
//               {assignedCandidates.map((group, index) => {
//                 const { width, height } = getCardSize(group.candidates.length);
//                 return (
//                   <Marker
//                     key={index}
//                     position={group.coords}
//                     icon={L.divIcon({
//                       className: "",
//                       html: `
//             <div style="
//               display: flex;
//               flex-direction: column;
//               align-items: center;
//               text-align: center;
//             ">
//               <div style="
//               color: #0288d1;
//               font-size: 15px;
//               font-weight: bold;
//               background-color: rgba(255, 255, 255, 0.8);
//               padding: 4px 8px;
//               border-radius: 6px;
//               border: 1px solid #0288d1;
//               white-space: nowrap;
//               max-width: 150px;
//               overflow: hidden;
//               text-overflow: ellipsis;
//               box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//               display: flex;
//               align-items: center;
//                      gap: 4px;
//                       ">
//                          ${group.city} 
//                        <svg xmlns="http://www.w3.org/2000/svg" fill="#0288d1" height="19" viewBox="0 0 24 24" width="19">
//                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h7v-3h2v3h7v-3.5c0-2.33-4.67-3.5-7-3.5h-2z"/>
//                      </svg>
//                     (${group.candidates.length})
//                     </div>
//                     `,
//                       iconAnchor: [0, 0],
//                     })}
//                     eventHandlers={{
//                       mouseover: () => setOpenTooltipId(index),
//                       click: () => setOpenTooltipId(index),
//                     }}
//                   >
//                     {openTooltipId === index && (
//                       <Tooltip
//                         direction="auto"
//                         opacity={1}
//                         className="custom-tooltip"
//                         permanent
//                         interactive
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexDirection: "row",
//                             gap: 2,
//                             overflowX: "auto",
//                           }}
//                           onMouseLeave={() => setOpenTooltipId(null)}
//                         >
//                           {group.candidates.map((candidate, idx) => (
//                             <Box
//                               key={candidate.id}
//                               sx={{
//                                 width,
//                                 height,
//                                 paddingTop: { sm: 3, lg: 3.4, xl: 4.1 },
//                                 margin: "1%",
//                                 boxSizing: "border-box",
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "stretch",
//                               }}
//                             >
//                               <CandidateCard
//                                 style={{ height: "100%" }}
//                                 candidate={{
//                                   ...candidate,
//                                   clinIQ: `Skillintel\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0  ${candidate.match_score}%`,
//                                   clinScore: "Not Assessed",
//                                   candidateName: candidate.candidate_name,
//                                   experience: candidate.total_experience,
//                                   availability:
//                                     candidate.availability === "0"
//                                       ? "Immediately available"
//                                       : ` ${candidate.availability} `,
//                                 }}
//                                 index={idx}
//                                 total={group.candidates.length}
//                               >
//                                 <CardActions
//                                   sx={{
//                                     width: "100%",
//                                     display: "flex",
//                                     justifyContent: "center",
//                                   }}
//                                 >
//                                   {candidate.status === "shortlisted" ? (
//                                     <Box
//                                       display="flex"
//                                       flexDirection="column"
//                                       gap={1}
//                                     >
//                                       <Button
//                                         variant="text"
//                                         color="secondary"
//                                         disabled
//                                       >
//                                         Shortlisted
//                                       </Button>
//                                       <Button
//                                         variant="outlined"
//                                         color="primary"
//                                         onClick={handleClickDashboard}
//                                       >
//                                          job Dashboard
//                                       </Button>
//                                       <Button
//                             variant="contained"
//                             sx={{
//                                         backgroundColor: "#00bbd4",
//                                         color: "#fff",
//                                         "&:hover": {
//                                           backgroundColor: "#00D0F7",
//                                         },
//                                       }}
//                             onClick={() => handleClickInterview(candidate.id)}
//                             >
//                             View Profile
//                             </Button>
//                                     </Box>
//                                   ) : (
//                                     <Button
//                                       variant="contained"
//                                       sx={{
//                                         backgroundColor: "#00bbd4",
//                                         color: "#fff",
//                                         "&:hover": {
//                                           backgroundColor: "#00D0F7",
//                                         },
//                                       }}
//                                       onClick={() =>
//                                         handleClickInterview(candidate.id)
//                                       }
//                                     >
//                                       View Profile
//                                     </Button>
//                                   )}
//                                 </CardActions>
//                               </CandidateCard>
//                             </Box>
//                           ))}
//                         </Box>
//                       </Tooltip>
//                     )}
//                   </Marker>
//                 );
//               })}
//             </MapContainer>
//           ) : (
//             <Typography
//               variant="h6"
//               color="text.secondary"
//               sx={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//               }}
//             >
//               No candidates found for map view.
//             </Typography>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// });

// export default CandidateClino;
