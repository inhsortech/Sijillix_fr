import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><Provider store={store}><BrowserRouter><ConfigProvider theme={{ token: { colorPrimary: "#1677ff", borderRadius: 9, fontFamily: "Inter, Arial, sans-serif" } }}><AntApp><App /></AntApp></ConfigProvider></BrowserRouter></Provider></React.StrictMode>);
