import React, { useState } from "react";
import { ConfigProvider, theme, Switch } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CharactersList from "./components/CharactersList";
import CharacterDetail from "./components/CharacterDetail";
import logo from "../src/assets/logo.png";
import "./App.css";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = (checked: boolean) => {
    setDarkMode(checked);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Router>
        <div
          className={`app-container ${darkMode ? "dark-theme" : "light-theme"}`}
        >
          <header className="header">
            <a href="/">
              <img
                src={logo}
                alt="Logo Star Wars"
                style={{ cursor: "pointer" }}
              />
            </a>
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined style={{ color: "#ffcc00" }} />}
              onChange={toggleTheme}
              style={{
                backgroundColor: darkMode ? "#001529" : "#f0f2f5",
                border: darkMode ? "1px solid #1890ff" : "1px solid #d9d9d9",
              }}
              className={`theme-switch ${
                darkMode ? "neon-effect-blue" : "neon-effect-yellow"
              }`}
            />
          </header>
          <main className="content">
            <Routes>
              <Route path="/" element={<CharactersList />} />
              <Route path="/character/:id" element={<CharacterDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
