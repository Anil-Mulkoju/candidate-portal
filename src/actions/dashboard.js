import { toast } from "react-toastify";
import api from "../api";
import _isEmpty from "lodash/isEmpty"

export const fetchCandidateCountByStatus = (status, setCandidates, setLoading) => {
    setLoading(true);
    const formattedStatus = status.toLowerCase();
  
    api.get(`/candidate_list_by_status?status=${formattedStatus}`, {
        headers: {
          Authorization: "Bearer ACCESS_TOKEN",
        },
      })
      .then((response) => {
        if (response.data.success) {
          if(!_isEmpty(response.data.data)){
            const candidates = response.data.data.candidates[formattedStatus] || [];
            setCandidates(candidates)
          }else{
            setCandidates([]);
          }
        } else {
          setCandidates([]);
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch candidates");
        console.error("Error fetching candidates:", error);
        setCandidates([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  