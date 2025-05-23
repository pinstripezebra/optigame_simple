import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./context/UserContext";
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
} from "react-router-dom";

import UserProfilePage from "./pages/UserProfile/UserProfilePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/LoginSignup/Login";
import Signup from "./pages/LoginSignup/Signup";
import Logout from "./pages/LoginSignup/Logout";
import { useUser } from "./context/UserContext";
import ProtectedRoute from "./pages/LoginSignup/ProtectedRoute";
import { UserGamesProvider } from "./context/UserGamesContext";
import GamePage from "./pages/GamePage/GamePage";

const router = createBrowserRouter([
  {
    path: "/Login",
    element: <Login />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/Logout",
    element: <Logout />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/Signup",
    element: <Signup />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
  },

  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <UserProfilePage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/asin/:asin",
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <UserProvider>
          <UserGamesProvider>
            <RouterProvider router={router} />
          </UserGamesProvider>
        </UserProvider>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
