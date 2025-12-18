import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";

import LoginPage from "../pages/login-page";
import MainLayout from "@/layout/main-layout";
import HomePage from "@/pages/home-page";

const router = createBrowserRouter([
  { path: "login", element: <LoginPage /> },

  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      {
        element: <MainLayout />,
        children: [
          {
            element: <HomePage />,
            path: "home",
          },
        ],
      },
    ],
  },
]);

export default router;
