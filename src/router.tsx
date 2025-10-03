// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
    ],
  },
]);

export default router;
