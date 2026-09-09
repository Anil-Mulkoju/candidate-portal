
// import { toast } from "react-toastify";
// import api from "../api";
// import candidateApi from "../services/candidateApi";

// export const fetchCandidateCompleteDetails = async(setLoading) => {
//   setLoading(true);

//   return candidateApi.get(`/candidate/get-candidates-complete-details`)
//     .then((response) => {
//       if (response.data.success) {
//         return response.data;
//       } else {
//         console.log("API Response (Failure):", response.data);
//         toast.error("Failed to fetch candidate details. Please try again.");
//         throw new Error("Failed to fetch candidate details");
//       }
//     })
//     .catch((error) => {
//       toast.error(`Error fetching candidate details: ${error.message}`);
//       throw error; 
//     })
//     .finally(() => {
//       setLoading(false);
//     });
// };

// // ====================== project api =============================//

// export const saveProject = async (projectData) => {
//     try {
//       const response = await api.post(
//         '/candidates/add-projects',
//         [projectData],
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       toast.success("Project saved successfully.");
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to save project';
//       toast.error(errorMessage);
//       throw new Error(errorMessage);
//     }
//   };
  

// //======================== Career profile ==============================//

//   export const saveCareerProfile = async (careerData) => {
//     try {
//       const response = await api.post(
//         '/candidates/add-careerprofile',
//         [careerData],
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       toast.success("careerData saved successfully.");
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to save careerData';
//       toast.error(errorMessage);
//       throw new Error(errorMessage);
//     }
//   };

// //   ============================== PersonalDetails api ===================================//


// export const savePersonalDetails = async (personalData) => {
//     try {
//       const response = await api.post(
//         '/candidates/add-personal-details',
//         [personalData],
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       toast.success("personalData saved successfully.");
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to save personalData';
//       toast.error(errorMessage);
//       throw new Error(errorMessage);
//     }
//   };

// //   ========================= 
// // export const savePersonalDetails = async (personalData) => {
// //     try {
// //       const response = await api.post(
// //         '/candidates/add-personal-details',
// //         [personalData],
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //         }
// //       );
// //       toast.success("personalData saved successfully.");
// //       return response.data;
// //     } catch (error) {
// //       const errorMessage = error.response?.data?.message || error.message || 'Failed to save personalData';
// //       toast.error(errorMessage);
// //       throw new Error(errorMessage);
// //     }
// //   };