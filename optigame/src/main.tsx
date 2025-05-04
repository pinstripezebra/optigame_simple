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

import UsersPage from "./pages/UsersPage";
import UserProfilePage from "./pages/UserProfilePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./components/LoginSignup/Login";
import Signup from "./components/LoginSignup/Signup";
import Logout from "./components/LoginSignup/Logout";

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
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/user",
    element: <UsersPage />,
  },

  {
    path: "/user/:userId",
    element: (
      <UserProfilePage
        username="JohnDoe"
        email="johndoe@example.com"
        games={[]}
      />
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <ChakraProvider>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ChakraProvider>
    </UserProvider>
  </React.StrictMode>
);
