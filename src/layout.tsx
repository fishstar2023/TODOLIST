// src/Layout.tsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

const tabs = [
  { path: "/", label: "🏠 Home" },
  { path: "/todo", label: "✅ To Do" },
  { path: "/calendar", label: "📅 Calendar" },
  { path: "/fatloss", label: "📊 Fat Loss" },
  { path: "/todo-calendar", label: "🗓️ Todo Calendar" },
];

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="layout-container">
      <nav className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? "☰" : "❌"}
        </button>

        {!collapsed && (
          <>
            <h2 className="app-title">Urania's App</h2>
            <ul className="tabs">
              {tabs.map((tab) => (
                <li key={tab.path}>
                  <NavLink
                    to={tab.path}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {tab.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
