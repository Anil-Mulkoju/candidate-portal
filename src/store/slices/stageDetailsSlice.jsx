import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stageData: {}, // key: stageName, value: array of candidates
  loading: false,
  error: null,
};

const stageDetailsSlice = createSlice({
  name: 'stageDetails',
  initialState,
  reducers: {
    setStageData: (state, action) => {
      const { stage, data } = action.payload;
      state.stageData[stage] = data;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setStageData, setLoading } = stageDetailsSlice.actions;
export default stageDetailsSlice.reducer;