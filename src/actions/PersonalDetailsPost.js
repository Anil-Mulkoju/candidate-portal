import api from "../api"; 

export const  addPersonalDetails= async (token,personalDetails) => {
  try {
    const response = await api.post(
      "/candidates/add-personal-details",personalDetails, 
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
