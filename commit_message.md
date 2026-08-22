# Detailed Git Commit File-by-File Changes

This file lists every changed file in the repository separated by Client and Server, with a brief explanation of what the change does.

## Client Changes

### [MODIFIED] `client/package.json`
  * Updated dependencies and devDependencies versions.

### [MODIFIED] `client/src/App.jsx`
  * Integrated main context providers and system routing.

### [MODIFIED] `client/src/FolderPages/FolderCard.jsx`
  * Refactored folder navigator hierarchy and layout states.

### [MODIFIED] `client/src/FolderPages/FolderTree.jsx`
  * Refactored folder navigator hierarchy and layout states.

### [MODIFIED] `client/src/FolderPages/GridView/RawLayout.jsx`
  * Implemented list/grid toggle options for drive views.

### [MODIFIED] `client/src/FolderPages/GridView/RecycleBinLayout.jsx`
  * Implemented list/grid toggle options for drive views.

### [MODIFIED] `client/src/FolderPages/GridView/RecycleSortListLayout.jsx`
  * Implemented list/grid toggle options for drive views.

### [MODIFIED] `client/src/FolderPages/GridView/SortListLayout.jsx`
  * Implemented list/grid toggle options for drive views.

### [MODIFIED] `client/src/FolderPages/GridView/SwitchLayout.jsx`
  * Implemented list/grid toggle options for drive views.

### [MODIFIED] `client/src/FolderPages/InfoDialogsModal.jsx`
  * Modified or added implementation details in `InfoDialogsModal.jsx`.

### [MODIFIED] `client/src/FolderPages/Photos.jsx`
  * Modified or added implementation details in `Photos.jsx`.

### [MODIFIED] `client/src/FolderPages/RecycleBin.jsx`
  * Modified or added implementation details in `RecycleBin.jsx`.

### [MODIFIED] `client/src/FolderPages/StarredPage.jsx`
  * Modified or added implementation details in `StarredPage.jsx`.

### [MODIFIED] `client/src/Pages/Admin/analytics-charts.jsx`
  * Added charts for user registration growth trends.

### [MODIFIED] `client/src/Pages/Admin/dashboard-layout.jsx`
  * Structured admin panel layouts dynamically based on selected views and sidebar states.

### [MODIFIED] `client/src/Pages/Admin/dashboard-view.jsx`
  * Rendered admin metrics widgets for online users, registered growth, and storage allocations.

### [MODIFIED] `client/src/Pages/Admin/edit-user-modal.jsx`
  * Created pop-up modal to update user profiles, change roles, and assign storage quotas.

### [MODIFIED] `client/src/Pages/Admin/logs-view.jsx`
  * Created table listing recent system audit logs with search filter options.

### [DELETED] `client/src/Pages/Admin/settings-view.jsx`
  * Removed the file from the repository, cleaning up obsolete code or unused views.

### [MODIFIED] `client/src/Pages/Admin/sidebar.jsx`
  * Updated branding to SynkDrive, added Back to Drive navigation option, created user profile header, and added mobile-responsive menus.

### [MODIFIED] `client/src/Pages/Admin/storage-view.jsx`
  * Modified or added implementation details in `storage-view.jsx`.

### [MODIFIED] `client/src/Pages/Admin/top-nav.jsx`
  * Enhanced navigation headers with user status and logout integrations.

### [MODIFIED] `client/src/Pages/Admin/users-table.jsx`
  * Redesigned user table displaying role badges, storage usage graphs, and actions for force logging out or deleting users based on manager permissions.

### [MODIFIED] `client/src/Pages/Admin/users-view.jsx`
  * Modified or added implementation details in `users-view.jsx`.

### [MODIFIED] `client/src/Pages/Auth.jsx`
  * Modified or added implementation details in `Auth.jsx`.

### [MODIFIED] `client/src/Pages/EmptyFolderPage.jsx`
  * Modified or added implementation details in `EmptyFolderPage.jsx`.

### [MODIFIED] `client/src/Pages/SearchPage.jsx`
  * Modified or added implementation details in `SearchPage.jsx`.

### [MODIFIED] `client/src/Pages/settings/account-management.jsx`
  * Modified or added implementation details in `account-management.jsx`.

### [MODIFIED] `client/src/Pages/settings/logout-section.jsx`
  * Modified or added implementation details in `logout-section.jsx`.

### [MODIFIED] `client/src/Pages/settings/profile-header.jsx`
  * Modified or added implementation details in `profile-header.jsx`.

### [MODIFIED] `client/src/Pages/settings/storage-usage.jsx`
  * Modified or added implementation details in `storage-usage.jsx`.

### [MODIFIED] `client/src/Pages/settings/top-header.jsx`
  * Modified or added implementation details in `top-header.jsx`.

### [MODIFIED] `client/src/Pages/share/EmailSharePage.jsx`
  * Refactored sharing UI to configure permissions and list people who have access.

### [MODIFIED] `client/src/Pages/share/SharePage.jsx`
  * Refactored sharing UI to configure permissions and list people who have access.

### [DELETED] `client/src/Pages/share/activity-feed.jsx`
  * Removed the file from the repository, cleaning up obsolete code or unused views.

### [DELETED] `client/src/Pages/share/collaborators.jsx`
  * Removed the file from the repository, cleaning up obsolete code or unused views.

### [DELETED] `client/src/Pages/share/share-analytics.jsx`
  * Removed the file from the repository, cleaning up obsolete code or unused views.

### [MODIFIED] `client/src/Pages/share/share-stats.jsx`
  * Modified or added implementation details in `share-stats.jsx`.

### [MODIFIED] `client/src/Pages/share/shared-by-me.jsx`
  * Modified or added implementation details in `shared-by-me.jsx`.

### [MODIFIED] `client/src/Pages/share/shared-with-me.jsx`
  * Modified or added implementation details in `shared-with-me.jsx`.

### [MODIFIED] `client/src/Pages/subscriptions/CheckoutPage.jsx`
  * Updated subscription pricing tables and payment checkout workflows.

### [MODIFIED] `client/src/Pages/subscriptions/Plans.jsx`
  * Updated subscription pricing tables and payment checkout workflows.

### [MODIFIED] `client/src/Pages/subscriptions/PricingPage.jsx`
  * Updated subscription pricing tables and payment checkout workflows.

### [MODIFIED] `client/src/Pages/subscriptions/SubscriptionManagePage.jsx`
  * Fully rewritten to enable user subscription controls (pause, resume, cancel) and display invoices list.

### [MODIFIED] `client/src/Pages/subscriptions/SuccessPage.jsx`
  * Modified or added implementation details in `SuccessPage.jsx`.

### [MODIFIED] `client/src/Pages/userProfile/UserProfile.jsx`
  * Modified or added implementation details in `UserProfile.jsx`.

### [MODIFIED] `client/src/api/SubscriptionApi.jsx`
  * Registered Axios mappings to file, share, and payment endpoints.

### [MODIFIED] `client/src/api/fileApi.jsx`
  * Registered Axios mappings to file, share, and payment endpoints.

### [MODIFIED] `client/src/api/shareApi.jsx`
  * Registered Axios mappings to file, share, and payment endpoints.

### [MODIFIED] `client/src/components/Header/Header.jsx`
  * Modified or added implementation details in `Header.jsx`.

### [MODIFIED] `client/src/components/Sidebare/SideBare.jsx`
  * Modified or added implementation details in `SideBare.jsx`.

### [MODIFIED] `client/src/components/imports/GoogleDriveImport.jsx`
  * Implemented UI layout for selecting and importing files from Google Drive.

### [MODIFIED] `client/src/components/storage/ActionCard.jsx`
  * Updated visual indicators for storage quotas and upgrade recommendations.

### [MODIFIED] `client/src/components/storage/StorageUsage.jsx`
  * Updated visual indicators for storage quotas and upgrade recommendations.

### [MODIFIED] `client/src/components/ui/dropdown-menu.jsx`
  * Modified or added implementation details in `dropdown-menu.jsx`.

### [MODIFIED] `client/src/contextApi/AuthContext.jsx`
  * Modified or added implementation details in `AuthContext.jsx`.

### [MODIFIED] `client/src/contextApi/FileProgress.jsx`
  * Modified or added implementation details in `FileProgress.jsx`.

### [MODIFIED] `client/src/hooks/useFolder.js`
  * Modified or added implementation details in `useFolder.js`.

### [MODIFIED] `client/src/hooks/useShare.js`
  * Modified or added implementation details in `useShare.js`.

### [MODIFIED] `client/src/hooks/useSubscription.js`
  * Modified or added implementation details in `useSubscription.js`.

### [MODIFIED] `client/src/index.css`
  * Customized tailwind rules for dashboard styles and custom overlays.

### [MODIFIED] `client/src/layout/MainLayout.jsx`
  * Implemented list/grid toggle options for drive views.

### [MODIFIED] `client/src/layout/SharedLayout.jsx`
  * Implemented list/grid toggle options for drive views.

### [MODIFIED] `client/src/layout/SubscriptionLayout.jsx`
  * Implemented list/grid toggle options for drive views.

### [MODIFIED] `client/src/lib/FolderSlice.js`
  * Modified or added implementation details in `FolderSlice.js`.

### [MODIFIED] `client/src/lib/RecycleSlice.js`
  * Modified or added implementation details in `RecycleSlice.js`.

### [MODIFIED] `client/src/lib/dashboardSlice.js`
  * Modified or added implementation details in `dashboardSlice.js`.

### [MODIFIED] `client/src/models/AlertDialogDemo.jsx`
  * Modified or added implementation details in `AlertDialogDemo.jsx`.

### [MODIFIED] `client/src/models/BasicMenu.jsx`
  * Modified or added implementation details in `BasicMenu.jsx`.

### [MODIFIED] `client/src/models/DeleteAlrightModal.jsx`
  * Modified or added implementation details in `DeleteAlrightModal.jsx`.

### [MODIFIED] `client/src/models/DropDownMenu.jsx`
  * Modified or added implementation details in `DropDownMenu.jsx`.

### [MODIFIED] `client/src/models/RecycleDownMenu.jsx`
  * Modified or added implementation details in `RecycleDownMenu.jsx`.

### [MODIFIED] `client/src/models/RecycleFolderTree.jsx`
  * Refactored folder navigator hierarchy and layout states.

### [MODIFIED] `client/src/models/ShareModal.jsx`
  * Refactored sharing UI to configure permissions and list people who have access.

### [MODIFIED] `client/src/models/SubscriptionModal.jsx`
  * Modified or added implementation details in `SubscriptionModal.jsx`.

### [MODIFIED] `client/src/routers/Router.jsx`
  * Defined routes for admin dashboard view, role protection, and default 404 pages.

### [MODIFIED] `client/src/utils/Helpers.jsx`
  * Integrated SDK helpers for handling calculations or Razorpay checkout scripts.

### [MODIFIED] `client/src/utils/Razorpay.js`
  * Integrated SDK helpers for handling calculations or Razorpay checkout scripts.

### [MODIFIED] `client/src/utils/ShareFilePreview.jsx`
  * Modified or added implementation details in `ShareFilePreview.jsx`.

### [DELETED] `client/test.js`
  * Removed the file from the repository, cleaning up obsolete code or unused views.

### [NEW] `client/script.sh`
  * Modified or added implementation details in `script.sh`.

### [NEW] `client/src/Pages/NotFoundPage.jsx`
  * Added a default fallback UI page for handling 404 routes in the application.

### [NEW] `client/src/api/AdminApi.jsx`
  * Added AXIOS request configurations pointing to admin metrics, user controls, bulk utilities, and audit log routes.

### [NEW] `client/src/contextApi/FilePreviewContext.jsx`
  * Created context provider for managing file preview overlays and active previews globally.

### [NEW] `client/src/models/SharebyEmaile.jsx`
  * Added email modal view enabling sharing files with specific emails.

### [NEW] `client/src/routers/RoleProtectedRoute.jsx`
  * Restricts access to client routes (such as the admin dashboard) to authorized roles (Admin, Manager) only.

## Server Changes

### [MODIFIED] `server/app.js`
  * Integrated admin router, mounted public share file routes, integrated public access rate limiters, fixed port to 4000, and enabled module export.

### [DELETED] `server/config/google.js`
  * Removed the file from the repository, cleaning up obsolete code or unused views.

### [MODIFIED] `server/controllers/authController.js`
  * Implemented secure token-based user sign-ups and updates.

### [MODIFIED] `server/controllers/fileController.js`
  * Mapped file functions to mongoose ObjectIds, added mime-type detection, supported JSON output options for previews, and tracked Google Drive upload progress.

### [MODIFIED] `server/controllers/folderController.js`
  * Mapped folder handlers to Mongoose ObjectId and verified schema compliance.

### [MODIFIED] `server/controllers/recycleBinController.js`
  * Modified or added implementation details in `recycleBinController.js`.

### [MODIFIED] `server/controllers/shareContoller.js`
  * Refactored sharing logic to merge new collaborators into existing share files, search users by email, and retrieve sharing metrics.

### [MODIFIED] `server/controllers/starredController.js`
  * Modified or added implementation details in `starredController.js`.

### [MODIFIED] `server/controllers/subscriptionController.js`
  * Created API handlers for Razorpay subscription management: handling status updates, invoice lists, pausing, resuming, and cancellations.

### [MODIFIED] `server/controllers/userController.js`
  * Modified or added implementation details in `userController.js`.

### [MODIFIED] `server/cron/index.js`
  * Modified or added implementation details in `index.js`.

### [MODIFIED] `server/cron/subscriptionCron.js`
  * Modified or added implementation details in `subscriptionCron.js`.

### [MODIFIED] `server/middlewares/authMiddleware.js`
  * Modified or added implementation details in `authMiddleware.js`.

### [MODIFIED] `server/middlewares/errorHandle.js`
  * Modified or added implementation details in `errorHandle.js`.

### [MODIFIED] `server/middlewares/vaildldMidleware.js`
  * Modified or added implementation details in `vaildldMidleware.js`.

### [MODIFIED] `server/models/emailShareModal.js`
  * Refactored sharing UI to configure permissions and list people who have access.

### [MODIFIED] `server/models/linkShareModel.js`
  * Modified or added implementation details in `linkShareModel.js`.

### [MODIFIED] `server/models/userModel.js`
  * Modified or added implementation details in `userModel.js`.

### [MODIFIED] `server/package.json`
  * Updated dependencies and devDependencies versions.

### [MODIFIED] `server/routers/authRouter.js`
  * Modified or added implementation details in `authRouter.js`.

### [MODIFIED] `server/routers/shareRouter.js`
  * Modified or added implementation details in `shareRouter.js`.

### [MODIFIED] `server/routers/subscriptionRouter.js`
  * Modified or added implementation details in `subscriptionRouter.js`.

### [MODIFIED] `server/routers/userRouter.js`
  * Modified or added implementation details in `userRouter.js`.

### [MODIFIED] `server/services/file/index.js`
  * Modified or added implementation details in `index.js`.

### [MODIFIED] `server/services/file/s3Servies.js`
  * Modified or added implementation details in `s3Servies.js`.

### [MODIFIED] `server/services/getEmailTemplate.js`
  * Modified or added implementation details in `getEmailTemplate.js`.

### [MODIFIED] `server/services/recycleBin/index.js`
  * Modified or added implementation details in `index.js`.

### [MODIFIED] `server/services/sendInviteEmail.js`
  * Modified or added implementation details in `sendInviteEmail.js`.

### [MODIFIED] `server/services/webhooks/handleActivatedEvent.js`
  * Modified or added implementation details in `handleActivatedEvent.js`.

### [MODIFIED] `server/services/webhooks/handleCancelledEvent.js`
  * Modified or added implementation details in `handleCancelledEvent.js`.

### [DELETED] `server/services/webhooks/handleChargedEvent.js`
  * Removed the file from the repository, cleaning up obsolete code or unused views.

### [DELETED] `server/services/webhooks/handleHaltedEvent.js`
  * Removed the file from the repository, cleaning up obsolete code or unused views.

### [MODIFIED] `server/services/webhooks/handlePausedEvent.js`
  * Modified or added implementation details in `handlePausedEvent.js`.

### [DELETED] `server/services/webhooks/handlePaymentFailedEvent.js`
  * Removed the file from the repository, cleaning up obsolete code or unused views.

### [MODIFIED] `server/services/webhooks/handleResumedEvent.js`
  * Modified or added implementation details in `handleResumedEvent.js`.

### [MODIFIED] `server/utils/RateLimiter.js`
  * Configured specific API endpoint rate limit configurations with privacy-compliant hashed IP key generators.

### [MODIFIED] `server/utils/cookieUtil.js`
  * Handled secure settings for session cookies.

### [MODIFIED] `server/utils/getPlanDetails.js`
  * Modified or added implementation details in `getPlanDetails.js`.

### [MODIFIED] `server/utils/googleOAuth2.js`
  * Modified or added implementation details in `googleOAuth2.js`.

### [MODIFIED] `server/utils/helperUtil.js`
  * Modified or added implementation details in `helperUtil.js`.

### [MODIFIED] `server/utils/multer.js`
  * Modified or added implementation details in `multer.js`.

### [MODIFIED] `server/utils/serviceControl.js`
  * Updated subscription enable/disable user services: safely scales storage thresholds and deletes excess active sessions instead of deleting user files.

### [NEW] `server/controllers/adminController.js`
  * Implemented administration capabilities: metrics collection, user storage usage aggregation, bulk user deletion/logout, session tracking, and audit log retrieval.

### [NEW] `server/cron/recycleBinCron.js`
  * Added a cron schedule that scans and permanently purges expired files and folders from the recycle bin after the user's `restoreFileDays` has elapsed.

### [NEW] `server/lambda.js`
  * Added AWS Lambda deployment handlers for serverless function triggers.

### [NEW] `server/models/auditLogModel.js`
  * Defined schema for recording critical administrator actions like user updates, session revocations, and deletions.

### [NEW] `server/routers/adminRouter.js`
  * Registered secure administration endpoints under `/admin` with role enforcement (Admin, Manager).

## Other Changes

### [NEW] `.github/`
  * Modified or added implementation details in ``.

### [NEW] `commit_message.md`
  * Modified or added implementation details in `commit_message.md`.
