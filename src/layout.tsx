// src/Layout.tsx
import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", label: "🏠 Home" },
  { path: "/calendar", label: "📅 Calendar" },
];

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {/* Tab Bar */}
      <nav className="relative flex border-b justify-center">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end
            className={({ isActive }) =>
              `py-2 px-4 font-medium mx-2 ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-800"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}

        {/* 滑動底線 */}
        <span
          className="absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300"
          style={{
            width: `${100 / tabs.length}%`,
            left: `${tabs.findIndex((tab) => tab.path === location.pathname) * (100 / tabs.length)}%`,
          }}
        ></span>
      </nav>

      {/* 回首頁按鈕 (只在 Calendar 顯示) */}
      {location.pathname === "/calendar" && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🏠 回首頁
          </button>
        </div>
      )}

      {/* 子頁面 */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
