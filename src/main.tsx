import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "antd/dist/reset.css"; // CSS para o Ant Design (para antd v5, utilize reset.css)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
