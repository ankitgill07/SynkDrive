import { RouterProvider } from "react-router-dom"
import Header from "./components/Header/Header"
import router from "./routers/Router"
import RootLayout from "./layout/RootLayout"
import React from "react"


function App() {
  return <React.StrictMode>
    <RootLayout />
    <RouterProvider router={router} />
  </React.StrictMode>

}

export default App
