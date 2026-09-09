import api from "../api";

export const sendDemoRequest = async (formData) => {
  const urlEncodedData = new URLSearchParams({
    name: formData.name,
    email: formData.email,
    phone_number: formData.phone_number,
    company_name: formData.company_name,
    message: formData.message,
  });

  try {
    const response = await api.post(
      "/create_demo",
      urlEncodedData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting demo request:", error);
    throw error;
  }
};
