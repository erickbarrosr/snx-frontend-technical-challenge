import React, { useState } from "react";
import { ConfigProvider, theme, Switch } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CharactersList from "./components/CharactersList";
import CharacterDetail from "./components/CharacterDetail";
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
                src="../src/assets/logo.png"
                alt="Logo Star Wars"
                style={{ cursor: "pointer" }}
              />
            </a>
            <Switch
              checkedChildren="Dark"
              unCheckedChildren="Light"
              onChange={toggleTheme}
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
