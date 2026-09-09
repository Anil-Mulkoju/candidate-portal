import { createContext, useState } from "react";

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
const updateFormData = (section, updates) => {
  setFormData((prev) => ({
    ...prev,
    [section]: {
      ...prev[section],
      ...updates,
    },
  }));
};
  return (
    <CandidateContext.Provider value={{ formData, updateFormData, setInitialData }}>
      {children}
    </CandidateContext.Provider>
  );
};
