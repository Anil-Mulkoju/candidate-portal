import { toast } from "react-toastify";
import api from "../api";
import { ACCESS_TOKEN } from "../components/Utils/helper";

// export const updateCandidateStatus = (id, newStatus, setLoading) => {
//   setLoading(true);

//   return api.post(`/matched_candidates/update_status_v1?candidate_id=${id}&new_status=${newStatus}`, {}
//   ).then((response) => {
//     if (response.status == 200) {
//       // toast.success("candidate shortListed succesfully!")
//       return response.data;
//     }
//     else {
//       throw new Error(response.data.message);
//     }
//     return null;
//   })
//     .catch((error) => toast.error(error.message))
//     .finally(() => {
//       setLoading(false);
//     })

// }




export const updateCandidateStatus = async (
  candidateId,
  newStatus,
  reason = ""
) => {
  try {
    const response = await api.post(
      "/matched_candidates/update_status_v1",
      null, // no body
      {
        params: {
          candidate_id: candidateId,
          new_status: newStatus,
          reason: reason,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Status update failed:", error);
    throw error;
  }
};



export const fetchCandidateDashboardDetails = async (setLoading, selectedStatus, token) => {
  setLoading(true);
  return api.get(`/get_jobs_list_v1?status=${selectedStatus}`).then((response) => {
    setLoading(false)
    if (response.data.success) {
      if (response.data) {
        return response.data;
      } else {
        toast.error('Candidate data is empty.');
        return null;
      }
    } else {
      // toast.error(response.data.message || 'Candidate not found.');
      return null;
    }
  }).catch((error) => {
    // toast.error(error.message || 'Candidate not found.');
  }).finally(() => setLoading(false));
};

export const fetchCandidateOverview = async (job_details_id, setLoading) => {
  return api.get(`/get_job_details/${job_details_id}`).then((response) => {
    if (response.data.success) {
      if (response.data) {
        return response.data;
      } else {
        toast.error('Candidate data is empty.');
        return null;
      }
    } else {
      toast.error(response.data.message || 'Candidate not found.');
      return null;
    }
  }).catch((error) => {
    toast.error(error.message)
    return null;
  }).finally(() => setLoading(false));
};
export const fetchPipelineCandidates = async (job_details_id, setLoading,status="") => {
  return api.get(`/matched_candidates/by-job?job_details_id=${job_details_id}&&status=${status}`).then((response) => {
    if (response.data.success) {
      if (response.data) {
        return response.data;
      } else {
        toast.error('Candidate data is empty.');
        return null;
      }
    } else {
      toast.error(response.data.message || 'Candidate not found.');
      return null;
    }
  }).catch((error) => {
    toast.error(error.message)
    return null;
  }).finally(() => setLoading(false));
};