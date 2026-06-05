import { userAuth } from "@/contextApi/AuthContext";
import React, { useEffect } from "react";
import { formatSize } from "@/utils/Helpers";
import { useNavigate } from "react-router-dom";

function StorageUsage() {
  const { user, checkAuthorization } = userAuth();

  const used = user.usedStorage;
  const max = user.maxStorageLimite;

  const percentage = Math.min((used / max) * 100, 100);
  const navigate = useNavigate();

  const getBarColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-blue-500";
  };

  useEffect(() => {
    checkAuthorization();
  }, [used]);

  return (
    <div
      onClick={() => navigate("/drive/subscription")}
      className="cursor-pointer hover:bg-gray-100 rounded-xl p-3 transition"
    >
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">Storage</span>
        <span className="text-gray-500">
          {" "}
          {formatSize(used)} / {formatSize(max)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{percentage.toFixed(1)}% used</span>
        <span>{formatSize(max - used)} free</span>
      </div>
      {/* ✅ subtle hint */}
      <p className="text-xs text-blue-500 mt-2">Manage subscription →</p>
    </div>
  );
}

export default StorageUsage;
