import MainLayout from "@/layout/MainLayout"
import Auth from "@/Pages/Auth"
import { createBrowserRouter } from "react-router-dom"


const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: "",
                element: "hello"
            },
            {
                path: "/"
            }
        ]
    },
    {
        path: "signin",
        element: <Auth />
    },
    {
        path: "signup",
        element: <Auth />
    },

])

export default router