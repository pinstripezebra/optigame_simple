import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import React from "react"
import ReactDOM from "react-dom/client"
import HomePage from "./pages/HomePage"
import { createBrowserRouter } from "react-router-dom"


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <HomePage />
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>,
)