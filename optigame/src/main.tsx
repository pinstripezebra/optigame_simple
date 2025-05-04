import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UsersPage from "./pages/UsersPage";
import UserProfilePage from "./pages/UserProfilePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginSignup from "./components/LoginSignup/LoginSignup"

const router = createBrowserRouter([

  {
    path: "/LoginSignup",
    element: <LoginSignup />,
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

  { path: "/user/:userId", 
    element: <UserProfilePage username="JohnDoe" email="johndoe@example.com" games={[]} /> 
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
