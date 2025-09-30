// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import App from "./App";
import CalendarPage from "./components/todo/CalendarPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/calendar", element: <CalendarPage /> },
    ],
  },
]);

export default router;
