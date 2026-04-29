import { userAuth } from "@/contextApi/AuthContext";
import React, { useEffect } from "react";
import { formatSize } from "@/utils/Helpers";

function StorageUsage() {
  const { user, checkAuthorization } = userAuth();

  const used = user.usedStorage;
  const max = user.maxStorageLimite;

  const percentage = Math.min((used / max) * 100, 100);

  const getBarColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-blue-500";
  };

  useEffect(() => {
    checkAuthorization();
  }, [used]);



  return (
    <div className="w-full max-w-md p-4 bg-white rounded-2xl shadow-sm border">
      <div className="flex justify-between text-sm font-medium mb-2">
        <span>Storage</span>
        <span>
          {formatSize(used)} / {formatSize(max)}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Footer Info */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{percentage.toFixed(1)}% used</span>
        <span>{formatSize(max - used)} free</span>
      </div>

      {/* Warning Message */}
      {percentage >= 90 && (
        <p className="text-xs text-red-500 mt-2">
          You're almost out of storage. Upgrade your plan.
        </p>
      )}
    </div>
  );
}

export default StorageUsage;
