import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "./styles/index.scss";
import { AppWrapped } from "./Components/App/App";
import "./services/i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AppWrapped />
  </Provider>
);
