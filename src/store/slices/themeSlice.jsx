// // ─────────────────────────────────────────────────────────────────────────────
// // redux/slices/themeSlice.js
// // ─────────────────────────────────────────────────────────────────────────────
// import { createSlice } from "@reduxjs/toolkit";
// import { THEMES, STORAGE_KEY, DEFAULT_THEME_KEY } from "../../theme-system/themes";

// const initialState = {
//   themeKey: localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_KEY,
// };

// const themeSlice = createSlice({
//   name: "theme",
//   initialState,
//   reducers: {
//     setTheme: (state, action) => {
//       const key = action.payload;
//       if (!THEMES[key]) return;           // ignore unknown keys
//       state.themeKey = key;
//       localStorage.setItem(STORAGE_KEY, key); // persist across refreshes
//     },
//     resetTheme: (state) => {
//       state.themeKey = DEFAULT_THEME_KEY;
//       localStorage.setItem(STORAGE_KEY, DEFAULT_THEME_KEY);
//     },
//   },
// });

// export const { setTheme, resetTheme } = themeSlice.actions;

// // ── Selectors ──────────────────────────────────────────────────────────────
// export const selectThemeKey    = (state) => state.theme.themeKey;
// export const selectThemeObject = (state) => THEMES[state.theme.themeKey] || THEMES[DEFAULT_THEME_KEY];
// export const selectColors      = (state) => selectThemeObject(state).colors;

// export default themeSlice.reducer;  