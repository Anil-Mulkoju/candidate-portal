import { toast } from "react-toastify";
import api from "../api";

export const fetchCandidateCountByStatus = (setLoading) => {
  setLoading(true);

  return api.get(`/jobs/hiring-manager/status-summary`)
    .then((response) => {
      if (response.data.success) {
        return response.data;
      } else {
        console.log("API Response (Failure):", response.data);
      //   toast.error("Failed to fetch . Please try again.");
      //   throw new Error("Failed to fetch candidate details");
      }
    })
    .catch((error) => {
      // toast.error(`Error fetching candidate details: ${error.message}`);
      // throw error; 
    })
    .finally(() => {
      setLoading(false);
    });
};