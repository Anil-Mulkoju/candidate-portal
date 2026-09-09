// import { toast } from "react-toastify";
// import api from "../api";
// import SummaryPage from "../components/SummaryPage";

// export const updateSummaryData = (job_details_id, summary_Page, setLoading) => {
//     setLoading(true)
//     // const token=getItem(ACCESS_TOKEN)

//     const payload = {
//         summary: summary_Page
//     };
//     return api.post(`/update-job-summary/${job_details_id}`, payload
//     ).then((response) => {
//         if (response.data.success) {
//             console.log("response.data",response?.data);
            
//             return response.data;
//         }
//         else
//             return null;
//     })
//         .catch((error) => toast.error(error.message))
//         .finally(() => {
//             setLoading(false);
//         })

// }
