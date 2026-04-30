import MainLayout from "@/layout/MainLayout";
import Auth from "@/Pages/Auth";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRouter";
import ActionCard from "@/components/storage/ActionCard";
import DriveHome from "@/drive/DriveHome";
import ChildFoldersViews from "@/FolderPages/FolderCard";
import RecycleBin from "@/FolderPages/RecycleBin";
import Photos from "@/FolderPages/Photos";
import StarredPage from "@/FolderPages/StarredPage";
import { FileProgressProvider } from "@/contextApi/FileProgress";
import FolderWrapper from "@/drive/FolderWrapper";
import UserProfile from "@/Pages/userProfile/UserProfile";
import UserLayout from "@/layout/UserLayout";
import SharedLayout from "@/layout/SharedLayout";
import DashboardLayout from "@/Pages/Admin/dashboard-layout";
import SharePage from "@/Pages/share/SharePage";
import EmailSharePage from "@/Pages/share/EmailSharePage";
import  PricingPage  from "@/Pages/subscriptions/PricingPage";
import CheckoutPage from "@/Pages/subscriptions/CheckoutPage";

const router = createBrowserRouter([
  {
    path: "/drive",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
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
        ),
      },
      {
        path: "folder/:id",
        element: (
          <ProtectedRoute>
            <FolderWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: "photos",
        element: (
          <ProtectedRoute>
            <Photos />
          </ProtectedRoute>
        ),
      },
      {
        path: "shared-files",
        element: (
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>
        ),
      },
      {
        path: "favorite",
        element: (
          <ProtectedRoute>
            <StarredPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "recycle-bin",
        element: (
          <ProtectedRoute>
            <RecycleBin />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/drive/profile",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashbord",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/email/shared/:fileId",
    element: (
      <ProtectedRoute>
        <EmailSharePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/plain",
    element: (
      <ProtectedRoute>
        <PricingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/public/shared/:id",
    element: <SharePage />,
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
  },
  {
    path: "/auth/error",
    element: <h2>error</h2>,
  },
]);

export default router;
