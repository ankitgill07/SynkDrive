import { RouterProvider } from "react-router-dom"
import Header from "./components/Header/Header"
import router from "./routers/Router"


function App() {
  return <RouterProvider router={router} />
}

export default App
