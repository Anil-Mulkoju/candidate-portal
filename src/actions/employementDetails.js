import api from "../api"; 

export const addEmploymentDetails = async (token, employmentData) => {
  try {
    const response = await api.post(
      "/candidates/add-employment",
      employmentData, 
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
