// store/interviewSlice.js
import { createSlice } from "@reduxjs/toolkit";

const interviewSlice = createSlice({
  name: "interview",
  initialState: { latestScheduledInterview: null },
  reducers: {
    setLatestScheduledInterview: (state, action) => {
      state.latestScheduledInterview = action.payload;
    },
  },
});

export const { setLatestScheduledInterview } = interviewSlice.actions;
export default interviewSlice.reducer;