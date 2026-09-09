import { createContext, useCallback, useState } from "react";

export const CandidateContext = createContext();

export const CandidateProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    loginDetails:{},
    candidateDetails:{},
    employmentDetails: {},
    basicDetails: {},
    educationDetails: {},
    personalDetails: {},
    candidateCompleateDetails:{}
  });
console.log("formData...",formData);

  // const updateFormData = (updates) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     candidateDetails: {
  //       ...prev.candidateDetails,
  //       ...updates, // merge updates
  //     },
  //     employmentDetails: {
  //       ...prev.employmentDetails,
  //       ...updates, // merge updates
  //     },
  //   }));
  // };
// const updateFormData = (section, updates) => {
//   setFormData((prev) => ({
//     ...prev,
//     [section]: {
//       ...prev[section],
//       ...updates,
//     },
//   }));
// };
 const updateFormData = useCallback((section, updates) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  }, []);
  // Fill initial values from API response
  const setInitialData = (apiData) => {
    setFormData({
      candidateDetails: apiData || {},
      // basicDetails: apiData.basicDetails || {},
      // employment: apiData.employment || {},
      // education: apiData.education || {},
      // personalDetails: apiData.personalDetails || {},
    });
  };

  return (
    <CandidateContext.Provider value={{ formData, updateFormData, setInitialData }}>
      {children}
    </CandidateContext.Provider>
  );
};
