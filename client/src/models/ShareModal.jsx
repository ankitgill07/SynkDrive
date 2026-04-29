import { useState } from "react";
import {
  Copy,
  Mail,
  Trash2,
  X,
  Check,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import useShare from "@/hooks/useShare";
import { useForm } from "react-hook-form";

export default function ShareModal({ onClose, items }) {
  const {
    activeTab,
    setActiveTab,
    linkEnabled,
    linkPermission,
    handleToggle,
    shareLink,
    handleCopyLink,
    handleChangePermission,
    copied,
    isLoading,
    handleSendFileWitEmail,
    setEmail,
    email,
  } = useShare(items);

  const [selectedRole, setSelectedRole] = useState("Viewer");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "viewer",
    },
  });

  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Editor",
      avatar: "JD",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Viewer",
      avatar: "JS",
    },
  ]);

  const handleSendInvite = async () => {
    if (!email) return;
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      role: selectedRole,
      avatar: email.substring(0, 2).toUpperCase(),
    };
    setUsers([...users, newUser]);
    setEmail("");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold font-plusjakartaSans  text-gray-900">
              Share Document
            </h2>
            <p className="text-sm text-gray-500 font-inter  mt-1">
              Manage access and permissions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b font-inter border-gray-200 bg-gray-50 px-6">
          <button
            onClick={() => setActiveTab("link")}
            className={`px-4 py-4 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "link"
                ? "text-[#155dfc] border-[#155dfc]"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <LinkIcon size={18} />
              Share Link
            </div>
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`px-4 py-4 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "email"
                ? "text-[#155dfc] border-[#155dfc]"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail size={18} />
              Invite by Email
            </div>
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`px-4 py-4 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "shared"
                ? "text-[#155dfc] border-[#155dfc]"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>Shared With</span>
              {users.length > 0 && (
                <span className="bg-[#155dfc] text-white text-xs px-2 py-0.5 rounded-full">
                  {users.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 font-inter ">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : (
            <>
              {activeTab === "link" && (
                <div className="p-6 space-y-6">
                  {/* Premium Share Link Card */}
                  <div className="space-y-4">
                    {/* Header with Premium Toggle */}
                    <div className="flex items-center justify-between p-5 rounded-2xl  from-blue-50 via-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Share Document via Link
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Anyone with the link can access with selected
                          permissions
                        </p>
                      </div>
                      {/* Premium Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer ">
                        <button
                          onClick={handleToggle}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-14 h-8 rounded-full peer-checked:bg-[#155dfc] ${
                            linkEnabled
                              ? "bg-[#155dfc] shadow-lg shadow-blue-400/40"
                              : "bg-gray-300"
                          }`}
                        />
                        <span
                          className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
                            linkEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </label>
                    </div>

                    {/* Content Area */}
                    {linkEnabled && (
                      <div className="space-y-4">
                        {/* Permission Selection */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Choose Permission
                          </label>
                          <div className="flex gap-3">
                            {["viewer", "editor"].map((permission) => (
                              <button
                                key={permission}
                                onClick={() =>
                                  handleChangePermission(permission)
                                }
                                className={`flex-1 p-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all active:scale-95 ${
                                  linkPermission === permission
                                    ? "border-[#155dfc] bg-[#155dfc] text-white shadow-lg shadow-blue-300/40"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <span>
                                    {permission === "viewer" ? "👁️" : "✏️"}
                                  </span>
                                  <span className="capitalize">
                                    {permission}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Share Link Display */}
                        <div className="p-4 bg-white rounded-2xl border-2 border-gray-300 shadow-md">
                          <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                            Share Link
                          </p>
                          <div className="flex gap-2">
                            <div className="flex-1 flex items-center">
                              <input
                                type="text"
                                value={shareLink}
                                readOnly
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-l-xl text-sm text-gray-700 font-medium focus:outline-none"
                              />
                            </div>
                            <button
                              onClick={handleCopyLink}
                              className={`px-6 py-3 rounded-r-xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap active:scale-95 shadow-md ${
                                copied
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "bg-[#155dfc] text-white hover:bg-blue-700 shadow-lg shadow-blue-400/40"
                              }`}
                            >
                              {copied ? (
                                <>
                                  <Check size={20} />
                                  <span className="text-sm">Copied Link</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={20} />
                                  <span className="text-sm">Copy Link</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Permission Info */}
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-800">
                            <span className="font-semibold">
                              Current permission:
                            </span>{" "}
                            {linkPermission} access
                            {linkPermission === "viewer" &&
                              " - View only, no editing"}
                            {linkPermission === "editor" &&
                              " - Can view and edit"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Disabled State */}
                    {!linkEnabled && (
                      <div className="p-6 text-center bg-gray-50 rounded-xl border border-gray-200">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-3">
                          <LinkIcon size={24} className="text-gray-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          Link sharing disabled
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          Enable the toggle to create a shareable link
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Email Invite Tab */}
              {activeTab === "email" && (
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Invite People by Email
                    </h3>

                    <form
                      onSubmit={handleSubmit(handleSendFileWitEmail)}
                      action=""
                    >
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="email"
                            name="email"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Invalid email address",
                              },
                            })}
                            placeholder="Enter email address"
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:ring-offset-0"
                          />
                          <select
                            name="role"
                            {...register("role")}
                            className="px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:ring-offset-0"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        {errors.email && (
                          <p className="text-red-500 pt-1  text-sm  font-medium font-inter">
                            {errors.email.message}
                          </p>
                        )}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full px-4 py-3 bg-[#155dfc] text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Mail size={18} />
                          {isLoading ? "Sending Invite..." : "Send Invite"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {users.length > 0 && (
                    <>
                      <div className="h-px bg-gray-200" />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Recently Invited
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {users.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#155dfc] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                  {user.avatar}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {user.email}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {user.role}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Shared With Tab */}
              {activeTab === "shared" && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    People with Access
                  </h3>

                  {users.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-500">
                        No one has access yet
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Invite people using the email tab
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-[#155dfc] text-white rounded-full flex items-center justify-center text-sm font-semibold ">
                              {user.avatar}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ">
                            <select className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#155dfc]">
                              <option value="Viewer">Viewer</option>
                              <option value="Editor">Editor</option>
                              <option value="Admin">Admin</option>
                            </select>

                            <button
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors "
                              aria-label="Remove user"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
