import { createContext, useState } from "react";

// Create the context
export const AppContext = createContext();

export const MyProvider = ({ children }) => {
  const [loading, setLoading] = useState(null);
  const [formData, setFormData] = useState({});
  const [latestScheduledInterview, setLatestScheduledInterview] = useState(null);

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        formData,
        setFormData,
        latestScheduledInterview,
        setLatestScheduledInterview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
