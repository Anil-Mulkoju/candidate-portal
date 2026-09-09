import axios from "axios"
import { toast } from "react-toastify"
import api from "../api";
import candidateApi from "../services/candidateApi";

export const getUserDetails = async (token,setLoading) => {
    setLoading(true)
    return candidateApi.get(`/auth/candidate/get-candidate-details?token=${token}`).then((response) => {
        // console.log("response")
        if (response.data.success) {
            //  window.open(response.data.data.google_oauth_url)
            return response.data.data
        }
        else
            return null;
    })
        .catch((error) => toast.error(error.message))
        .finally(() => {
            setLoading(false)
        })
}

export const submitUserForm = async (formData, setLoading, token) => {
  const payload = new FormData();

  payload.append("first_name", formData.first_name);
  payload.append("last_name", formData.last_name);
  payload.append("email", formData.email);
  payload.append("phone_number", formData.phone_number);
  payload.append("work_status", formData.work_status);

  if (formData.resume) {
    payload.append("resume", formData.resume);
  }

  try {
    setLoading(true);
    const response = await api.post(
      "/candidate/upload-resume-additional-details/",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error.response || error);
    throw error;
  } finally {
    setLoading(false);
  }
};
