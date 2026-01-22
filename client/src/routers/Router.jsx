import MainLayout from "@/layout/MainLayout"
import Auth from "@/Pages/Auth"
import { createBrowserRouter, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRouter"
import ActionCard from "@/components/storage/ActionCard"
import DriveHome from "@/drive/DriveHome"
import ChildFoldersViews from "@/FoldersView/FolderCard"



const router = createBrowserRouter([

    {
        path: '/drive',
        element: (<ProtectedRoute>
            <MainLayout />
        </ProtectedRoute>),
        children: [
            {
                index: true,
                element: <Navigate to="home" replace />,
            },
            {

                path: "home",
                element: (
                    <ProtectedRoute>
                        <DriveHome />
                    </ProtectedRoute>
                )

            },
            {

                path: "folder/:id",
                element: (
                    <ProtectedRoute>
                        <DriveHome />
                    </ProtectedRoute>
                )
            },
            {

                path: "photos",
                element: <h2>photos</h2>

            },
            {

                path: "shared-files",
                element: <h2>shared-files</h2>

            },
            {

                path: "favorite",
                element: <h2>favorite</h2>

            },
            {

                path: "recycle-bin",
                element: <h2>recycle-bin</h2>

            },

        ]
    },
    {
        path: "/auth",
        element: <PublicRoute>
            <Auth />
        </PublicRoute>
    },
    {
        path: "/auth/error",
        element: <h2>error</h2>
    }

])

export default router