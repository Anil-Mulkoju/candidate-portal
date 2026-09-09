import api from "../api"; 

export const  addEducationDetails= async (token, educationData) => {
  try {
    const response = await api.post("/candidates/add-education",[educationData], 
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
