import { Provider } from "react-redux";
import { store } from "./store";
import { MyProvider } from "./AppContext";
import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MyProvider>
        <App />
      </MyProvider>
    </Provider>
  </React.StrictMode>
);