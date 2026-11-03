import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App as AntApp } from "antd";

import store from "./app/store";
import App from "./App";
import AuthInitializer from "./components/AuthInitializer";

import "antd/dist/reset.css";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <AntApp>
        <BrowserRouter>
          <AuthInitializer>
            <App />
          </AuthInitializer>
        </BrowserRouter>
      </AntApp>
    </Provider>
  </React.StrictMode>
);