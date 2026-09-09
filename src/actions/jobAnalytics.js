import api from "../api";

// export const fetchJobAnalytics = async (
//   setLoading,
//   analyticsView = "user"   
// ) => {
//   try {
//     setLoading(true);

//     // ================= QUERY PARAM =================
//     const queryParam =
//       analyticsView === "organisation"
//         ? "?organisation"
//         : "?user";

//     const response = await api.get(
//       `/organisations/job-analytics_v2${queryParam}`
//     );

//     if (response?.data?.success) {
//       return response.data;
//     }

//     return null;
//   } catch (error) {
//     console.error("Error fetching job analytics:", error);
//     return null;
//   } finally {
//     setLoading(false);
//   }
// };

// export const fetchJobAnalytics = async (setLoading, scope = "user") => {
//   try {
//     setLoading(true);

//     const response = await api.get(
//       `/organisations/job-analytics_v2?scope=${scope}`
//     );

//     if (response?.data?.success) {
//       return response.data;
//     }

//     return null;
//   } catch (error) {
//     console.error("Error fetching job analytics:", error);
//     return null;
//   } finally {
//     setLoading(false);
//   }
// };
