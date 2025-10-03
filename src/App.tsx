// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import TodoPage from "./components/todo/TodoPage";
import CalendarPage from "./components/todo/CalendarPage";
import FatLossTrackerPage from "./components/FatLossTrackerPage";
import TodoCalendarPage from "./components/TodoCalendarPage"; 
import SignUp from "./components/SignUp";

const HomePage: React.FC = () => (
  <div className="page-container">
    <h1>🏠 Home</h1>
    <p>Welcome to Urania's App!</p>
  </div>
);


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="todo" element={<TodoPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="fatloss" element={<FatLossTrackerPage />} />
        <Route path="todo-calendar" element={<TodoCalendarPage />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
};

export default App;
