// src/store/slices/jobSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: null,
  loading: false,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    patchFormData(state, action) {
  state.formData = { ...(state.formData || {}), ...action.payload };
},
  },
});

export const { setFormData, setLoading ,patchFormData,clearFormData } = jobSlice.actions;
export default jobSlice.reducer;