// import React, { useState, useEffect, useContext } from 'react';
// import { styled } from '@mui/material/styles';
// import {
//   Grid,
//   Typography,
//   Button,
//   Avatar,
//   TextField,
//   MenuItem,
//   Select,
//   Checkbox,
//   IconButton,
//   Box,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
// import WorkOffOutlinedIcon from '@mui/icons-material/WorkOffOutlined';
// import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
// import CasesOutlinedIcon from '@mui/icons-material/CasesOutlined';
// import CloseIcon from '@mui/icons-material/Close';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import _isArray from 'lodash/isArray';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar, Line } from 'react-chartjs-2';
// import { DashboardContainer, StatCard, SectionCard, JobItem, StatusChip } from './style';
// import { getDashboardStyles } from './style';
// import { AppContext } from '../../AppContext';
// import { ACCESS_TOKEN, getItem } from '../Utils/helper';
// import { fetchCandidateDashboardDetails } from '../../actions/jobDetails';
// import { fetchCandidateCountByStatus } from '../../actions/dashboardCount';
// import { width } from '@mui/system';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend
// );


// // const stats = [
// //   { title: 'Total Jobs', count: 120, Icon: BusinessCenterOutlinedIcon, bg: '#147cebff' },
// //   { title: 'Closed Jobs', count: 56, Icon: WorkOffOutlinedIcon, bg: '#ffe6e6' },
// //   { title: 'Shortlisted', count: 24, Icon: HowToRegOutlinedIcon, bg: '#e6fff2' },
// //   { title: 'Rejected', count: 13, Icon: CasesOutlinedIcon, bg: '#f0f0f0' },
// // ];

// const lineChartData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//   datasets: [
//     { label: 'Open', data: [20, 30, 40, 35, 50, 60], borderColor: '#00BBD4', backgroundColor: 'rgba(0, 187, 212, 0.2)', fill: true, tension: 0.4 },
//     { label: 'Closed', data: [10, 15, 20, 15, 20, 25], borderColor: '#FF1050', backgroundColor: 'rgba(255, 16, 80, 0.2)', fill: true, tension: 0.4 },
//     { label: 'In Progress', data: [15, 5, 20, 18, 5, 40], borderColor: '#9FDE53', backgroundColor: 'rgba(159, 222, 83, 0.2)', fill: true, tension: 0 },
//   ],
// };

// const barChartData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//   datasets: [
//     { label: 'Open', data: [20, 30, 40, 35, 50, 60], backgroundColor: '#00BBD4' },
//     { label: 'Closed', data: [10, 15, 20, 15, 20, 25], backgroundColor: '#FF1050' },
//     { label: 'In Progress', data: [8, 5, 12, 10, 12, 35], backgroundColor: '#9FDE53' },
//   ],
// };

// const EmployeDashboard = ({ selectedStatus = "all" }) => {
//   const classes = getDashboardStyles();
//   const [activeSearchTerm, setActiveSearchTerm] = useState('');
//   const [closedSearchTerm, setClosedSearchTerm] = useState('');
//   const [activeJobs, setActiveJobs] = useState([]);
//   const [closedJobs, setClosedJobs] = useState([]);
//   const [originalActiveJobs, setOriginalActiveJobs] = useState([]); // New state for original active jobs
//   const [originalClosedJobs, setOriginalClosedJobs] = useState([]); // New state for original closed jobs
//   const [activeFilterBy, setActiveFilterBy] = useState('');
//   const [closedFilterBy, setClosedFilterBy] = useState('');
//   const [activeFilterOpen, setActiveFilterOpen] = useState(false);
//   const [closedFilterOpen, setClosedFilterOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [statsData, setStatsData] = useState([]);
//   const { setLoading } = useContext(AppContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDashboardData();
//     fetchStatsData();
//   }, [selectedStatus]);

//   const fetchStatsData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetchCandidateCountByStatus(setLoading);
//       if (response && response.success) {
//         const { data } = response;
//         const stats = [
//           { title: 'Total Jobs', count: data.all || 0, Icon: BusinessCenterOutlinedIcon, bg: '#e6f2ff' },
//           { title: 'Open Jobs', count: data.open || 0, Icon: CasesOutlinedIcon, bg: '#f0f0f0' },
//           { title: 'Closed Jobs', count: data.closed || 0, Icon: WorkOffOutlinedIcon, bg: '#ffe6e6' },
//           { title: 'Shortlisted', count: data.candidates?.shortlisted || 0, Icon: HowToRegOutlinedIcon, bg: '#e6fff2' },
//         ];
//         setStatsData(stats);
//         setError(null);
//       } else {
//         setError(response.message || "Error fetching stats data.");
//         toast.error(response.message || "Error fetching stats data.");
//         setStatsData([]);
//       }
//     } catch (err) {
//       setError("Failed to fetch stats data.");
//       toast.error("Failed to fetch stats data.");
//       setStatsData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDashboardData = async () => {
//     const token = getItem(ACCESS_TOKEN);

//     if (!token) {
//       toast.error("Please login Again.");
//       setError("Authentication token not found.");
//       setActiveJobs([]);
//       setClosedJobs([]);
//       setOriginalActiveJobs([]); 
//       setOriginalClosedJobs([]); 
//       return;
//     }

//     setLoading(true);
//     try {
//       const normalizedStatus = selectedStatus.toLowerCase() === "all" ? "" : selectedStatus.toLowerCase();
//       if (normalizedStatus && !["open", "closed"].includes(normalizedStatus)) {
//         toast.error("Invalid status filter. Use 'open' or 'closed'.");
//         setError("Invalid status filter. Use 'open' or 'closed'.");
//         setActiveJobs([]);
//         setClosedJobs([]);
//         setOriginalActiveJobs([]); 
//         setOriginalClosedJobs([]); 
//         setLoading(false);
//         return;
//       }

//       const candidateDashboard = await fetchCandidateDashboardDetails(setLoading, normalizedStatus);
//       if (candidateDashboard && candidateDashboard.success) {
//         const jobData = candidateDashboard.data;
//         if (_isArray(jobData) && jobData.length > 0) {
//           const mappedData = jobData.map((item, index) => {
//             const status = item.status || "N/A";
//             return {
//               id: item.job_position_id || `row-${index}`,
//               job_details_id: item.job_details_id,
//               title: item.job_title || "Unknown Job",
//               location: item.location || "N/A",
//               status: status.charAt(0).toUpperCase() + status.slice(1),
//               requisitions: item.requisition || "N/A",
//               hiringManager: item.hmName || "N/A",
//               date: item.created_at || new Date().toISOString(),
//               color: status.toLowerCase() === "closed" ? "#FF1050" : "#00BBD4",
//             };
//           });

//           const active = mappedData.filter(
//             (job) => job.status.toLowerCase() !== "closed" && (!normalizedStatus || job.status.toLowerCase() === normalizedStatus)
//           );
//           const closed = mappedData.filter(
//             (job) => job.status.toLowerCase() === "closed" && (!normalizedStatus || normalizedStatus === "closed")
//           );

//           const hasValidIds = mappedData.every((row) => row && row.id != null);
//           if (hasValidIds) {
//             setActiveJobs(active);
//             setClosedJobs(closed);
//             setOriginalActiveJobs(active); 
//             setOriginalClosedJobs(closed); 
//             setError(null);
//           } else {
//             setError("Invalid data: Missing unique IDs for some rows.");
//             toast.error("Invalid data: Missing unique IDs for some rows.");
//             setActiveJobs([]);
//             setClosedJobs([]);
//             setOriginalActiveJobs([]);
//             setOriginalClosedJobs([]); 
//           }
//         } else {
//           setError("No job data available.");
//           // toast.error("No job data available.");
//           setActiveJobs([]);
//           setClosedJobs([]);
//           setOriginalActiveJobs([]); 
//           setOriginalClosedJobs([]);
//         }
//       } else {
//         setError(candidateDashboard.message || "Error fetching dashboard details.");
//         toast.error(candidateDashboard.message || "Error fetching dashboard details.");
//         setActiveJobs([]);
//         setClosedJobs([]);
//         setOriginalActiveJobs([]); 
//         setOriginalClosedJobs([]); 
//       }
//     } catch (err) {
//       // setError("Failed to fetch dashboard data.");
//       // toast.error("Failed to fetch dashboard data.");
//       setActiveJobs([]);
//       setClosedJobs([]);
//       setOriginalActiveJobs([]); 
//       setOriginalClosedJobs([]); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleActiveSearchChange = (event) => {
//     const term = event.target.value.toLowerCase();
//     setActiveSearchTerm(term);
//     filterJobs(term, activeFilterBy, 'active');
//   };

//   const handleClosedSearchChange = (event) => {
//     const term = event.target.value.toLowerCase();
//     setClosedSearchTerm(term);
//     filterJobs(term, closedFilterBy, 'closed');
//   };

//   const handleActiveFilterChange = (event) => {
//     const filter = event.target.value;
//     setActiveFilterBy(filter);
//     filterJobs(activeSearchTerm, filter, 'active');
//     setActiveFilterOpen(false);
//   };

//   const handleClosedFilterChange = (event) => {
//     const filter = event.target.value;
//     setClosedFilterBy(filter);
//     filterJobs(closedSearchTerm, filter, 'closed');
//     setClosedFilterOpen(false);
//   };

//   const handleClearActiveSearch = () => {
//     setActiveSearchTerm('');
//     setActiveJobs([...originalActiveJobs]); 
//     filterJobs('', activeFilterBy, 'active'); 
//   };

//   const handleClearClosedSearch = () => {
//     setClosedSearchTerm('');
//     setClosedJobs([...originalClosedJobs]); 
//     filterJobs('', closedFilterBy, 'closed'); 
//   };

//   const filterJobs = (search, filter, type) => {
//     let filteredJobs = type === 'active' ? [...originalActiveJobs] : [...originalClosedJobs]; 

//     if (search) {
//       const searchLower = search.toLowerCase();
//       filteredJobs = filteredJobs.filter(
//         (job) =>
//           job.title.toLowerCase().includes(searchLower) ||
//           job.id.toLowerCase().includes(searchLower) ||
//           job.location.toLowerCase().includes(searchLower) ||
//           job.status.toLowerCase().includes(searchLower)
//       );
//     }

//     if (filter) {
//       switch (filter) {
//         case 'name':
//           filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
//           break;
//         case 'country':
//           filteredJobs.sort((a, b) => a.location.localeCompare(b.location));
//           break;
//         case 'date':
//           filteredJobs.sort((a, b) => new Date(a.date) - new Date(b.date));
//           break;
//         default:
//           break;
//       }
//     }

//     if (type === 'active') {
//       setActiveJobs(filteredJobs);
//     } else {
//       setClosedJobs(filteredJobs);
//     }
//   };

//   const handleViewJob = (job) => {
//     navigate('/recruit/dashboard/Job-details', { state: { job_details_id: job.job_details_id } });
//   };

//   const handleViewAll = (type) => {
//     navigate('/recruit/dashboard/jobs', { state: { selectedStatus: type === 'active' ? 'open' : 'closed' } });
//   };

//   const FilterMenu = ({ filterBy, handleFilterChange, filterOpen, setFilterOpen }) => (
//     <Select
//       open={filterOpen}
//       onOpen={() => setFilterOpen(true)}
//       onClose={() => setFilterOpen(false)}
//       value={filterBy}
//       onChange={handleFilterChange}
//       displayEmpty
//       renderValue={(selected) =>
//         selected
//           ? { name: 'Name', country: 'Country', date: 'Date' }[selected] || ''
//           : ''
//       }
//       IconComponent={FilterListIcon}
//       MenuProps={{
//         anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
//         transformOrigin: { vertical: 'top', horizontal: 'right' },
//         PaperProps: { style: { minWidth: '150px' } },
//       }}
//       sx={{
        
//         '& .MuiSelect-select': { padding: '4px 8px', minWidth: '40px' },
//         '& .MuiOutlinedInput-root': { paddingRight: '4px !important', height: '30px' },
//         '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
//       }}
//       className={classes.sortSelect}
//     >
//       <MenuItem value='' sx={{  }}>
//         <Checkbox checked={!filterBy} /> None
//       </MenuItem>
//       <MenuItem value='name' sx={{  }}>
//         <Checkbox checked={filterBy === 'name'} /> Name
//       </MenuItem>
//       <MenuItem value='country' sx={{ }}>
//         <Checkbox checked={filterBy === 'country'} /> Country
//       </MenuItem>
//       {/* <MenuItem value='date' sx={{fontFamily: 'Poppins, sans-serif' }}>
//         <Checkbox checked={filterBy === 'date'} /> Date
//       </MenuItem> */}
//     </Select>
//   );

//   return (
//     <DashboardContainer className={classes.dashboard}>
//       {error && (
//         <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
//           {error}
//         </Typography>
//       )}
//       <Grid container spacing={1}>
//         {statsData.map((stat, idx) => (
//           <Grid item key={idx} size={{ xs: 12, sm: 6, lg: 3, xl:3 }}>
//             <StatCard>
//               <Box sx={{ padding: 1, textAlign: 'center', width: '100px', height: '60px', backgroundColor: stat.bg }}>
//                 <stat.Icon sx={{ fontSize: {sm:30,lg:40,xl:45}, color: '#595959' }} />
//               </Box>
//               <Box sx={{ textAlign: 'center', width: { xs: '100px', sm: '250px', lg: '150px' ,xl:'150px' }, height: '50px' }}>
//                 <Typography fontWeight={500} sx={{ fontSize: '16px' }} variant="body2" color="textSecondary">
//                   {stat.title}
//                 </Typography>
//                 <Typography fontWeight={550} color="#595959" sx={{ fontSize: '32px' }} variant="h6">
//                   {stat.count}
//                 </Typography>
//               </Box>
//             </StatCard>
//           </Grid>
//         ))}
//       </Grid>

//       <Grid container spacing={1} sx={{ mt: 1 }}>
//         <Grid item size={{ xs: 12, sm: 6, lg: 6,xl:6}}>
//           <SectionCard>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//               <Typography variant="h6" sx={{ fontSize: '16px',  }}>
//                 Active Requisitions
//               </Typography>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search..."
//                 value={activeSearchTerm}
//                 onChange={handleActiveSearchChange}
//                 InputProps={{
//                   startAdornment: (
//                     <Box sx={{ display: 'flex', alignItems: 'center',marginLeft: 22 }}>
//                       <SearchIcon sx={{ fontSize: '16px', color: '#595959', marginRight: 0.5 }} />
//                     </Box>
//                   ),
//                   endAdornment: (
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       {activeSearchTerm && (
//                         <IconButton size="small" onClick={handleClearActiveSearch}>
//                           <CloseIcon sx={{ fontSize: '16px' }} />
//                         </IconButton>
//                       )}
//                       {/* <FilterMenu
//                         filterBy={activeFilterBy}
//                         handleFilterChange={handleActiveFilterChange}
//                         filterOpen={activeFilterOpen}
//                         setFilterOpen={setActiveFilterOpen}
//                       /> */}
//                     </Box>
//                   ),
//                   sx: {
                    
//                     borderRadius: 2,
//                     height: '30px',
//                     fontSize: '12px',
//                     '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
//                   },
//                 }}
//                 sx={{
//                   flex: 1,
                  
//                   height: '30px',
//                   width: '300px',
//                 }}
//                 className={classes.searchInput}
//               />
//             </Box>
//             <Box className={classes.candidateList}>
//               {activeJobs.length > 0 ? (
//                 activeJobs.map((job) => (
//                   <JobItem key={job.id}>
//                     <Box display="flex" alignItems="center" gap={0.5}>
//                       <Avatar
//                         src="/images/DashboardPhotos/open.png"
//                         sx={{ width: 28, height: 28, backgroundColor: '#D7FAFF', padding: '2px' }}
//                       />
//                       <Box sx={{ ml: 1 }}>
//                         <Typography sx={{ color: '#595959', fontSize: '14px', }} fontWeight={500}>
//                           {job.title}
//                         </Typography>
//                         <Typography sx={{ color: '#000000', fontSize: '12px',  }} variant="caption" color="textSecondary">
//                           {job.id} • {job.location}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <StatusChip color={job.color} label={job.status} />
//                     <Button
//                       sx={{ borderRadius: '20px', fontSize: '12px', mr: 3 }}
//                       variant="outlined"
//                       size="small"
//                       onClick={() => handleViewJob(job)}
//                     >
//                       View
//                     </Button>
//                   </JobItem>
//                 ))
//               ) : (
//                 <Typography sx={{ color: '#595959', fontSize: '14px', textAlign: 'center' }}>
//                   No active jobs found.
//                 </Typography>
//               )}
//             </Box>
//             <Box sx={{ mt: 1 }}>
//               <Button
//                 onClick={() => handleViewAll('active')}
//                 fullWidth
//                 variant="text"
//                 sx={{ fontSize: '12px',  }}
//               >
//                 View All
//               </Button>
//             </Box>
//           </SectionCard>
//         </Grid>

//         <Grid item size={{ xs: 12, sm: 6, lg: 6 , xl:6 }}>
//           <SectionCard>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }} >
//               <Typography variant="h6" sx={{ fontSize: '16px',  }}>
//                 Closed Requisitions
//               </Typography>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search..."
//                 value={closedSearchTerm}
//                 onChange={handleClosedSearchChange}
//                 InputProps={{
//                   startAdornment: (
//                     <Box sx={{ display: 'flex', alignItems: 'center',marginLeft: 20 }}>
//                       <SearchIcon sx={{ fontSize: '16px', color: '#595959', marginLeft: 2 }} />
//                     </Box>
//                   ),
//                   endAdornment: (
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       {closedSearchTerm && (
//                         <IconButton size="small" onClick={handleClearClosedSearch}>
//                           <CloseIcon sx={{ fontSize: '16px' }} />
//                         </IconButton>
//                       )}
//                       {/* <FilterMenu
//                         filterBy={closedFilterBy}
//                         handleFilterChange={handleClosedFilterChange}
//                         filterOpen={closedFilterOpen}
//                         setFilterOpen={setClosedFilterOpen}
//                       /> */}
//                     </Box>
//                   ),
//                   sx: {
                   
//                     borderRadius: 2,
//                     height: '30px',
//                     fontSize: '12px',
//                     '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
//                   },
//                 }}
//                 sx={{
//                   flex: 1,
                  
//                   height: '30px',
//                   width: '300px',
//                 }}
//                 className={classes.searchInput}
//               />
//             </Box>
//             <Box className={classes.candidateList}>
//               {closedJobs.length > 0 ? (
//                 closedJobs.map((job) => (
//                   <JobItem key={job.id}>
//                     <Box display="flex" alignItems="center" gap={0.5}>
//                       <Avatar
//                         src="/images/DashboardPhotos/closed.png"
//                         sx={{ width: 24, height: 24 }}
//                       />
//                       <Box sx={{ ml: 1 }}>
//                         <Typography sx={{ color: '#595959', fontSize: '14px', }} fontWeight={500}>
//                           {job.title}
//                         </Typography>
//                         <Typography sx={{ color: '#000000', fontSize: '12px',  }} variant="caption" color="textSecondary">
//                           {job.id} • {job.location}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <StatusChip color={job.color} label={job.status} />
//                     <Button
//                       sx={{ borderRadius: '20px', fontSize: '12px', mr: 3 }}
//                       variant="outlined"
//                       size="small"
//                       onClick={() => handleViewJob(job)}
//                     >
//                       View
//                     </Button>
//                   </JobItem>
//                 ))
//               ) : (
//                 <Typography sx={{ color: '#595959', fontSize: '14px', textAlign: 'center' }}>
//                   No closed jobs found.
//                 </Typography>
//               )}
//             </Box>
//             <Box sx={{ mt: 1 }}>
//               <Button
//                 onClick={() => handleViewAll('closed')}
//                 fullWidth
//                 variant="text"
//                 sx={{ fontSize: '12px',  }}
//               >
//                 View All
//               </Button>
//             </Box>
//           </SectionCard>
//         </Grid>
//       </Grid>

//       <Grid container spacing={1} className={classes.charts}>
//         <Grid item size={{ xs: 12, sm: 6, lg: 6 , xl:6}}>
//           <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//             <Box sx={{ height: 250 }}>
//               <Line
//                 data={lineChartData}
//                 options={{
//                   maintainAspectRatio: false,
//                   scales: {
//                     y: { beginAtZero: true, ticks: { fontsize: 10,  } },
//                     x: { ticks: { font: { size: 10,  } } },
//                   },
//                   plugins: { legend: { labels: { font: { size: 10, } } } },
//                 }}
//               />
//             </Box>
//           </Box>
//         </Grid>
//         <Grid item size={{ xs: 12, sm: 6, lg: 6 ,xl:6}}>
//           <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//             <Box sx={{ height: 250 }}>
//               <Bar
//                 data={barChartData}
//                 options={{
//                   maintainAspectRatio: false,
//                   scales: {
//                     y: { beginAtZero: true, ticks: { font: { size: 10,  } } },
//                     x: { ticks: { font: { size: 10,  } } },
//                   },
//                   plugins: { legend: { labels: { font: { size: 10,  } } } },
//                 }}
//               />
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </DashboardContainer>
//   );
// };

// export default EmployeDashboard;