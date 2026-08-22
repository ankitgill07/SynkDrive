import { useState } from "react";
import { HardDrive, Download, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userAuth } from "@/contextApi/AuthContext";
import { formatSize } from "@/utils/Helpers";
export function StorageUsage() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const { user } = userAuth();
  const totalStorage = user.maxStorageLimite;
  const usedStorage = user.usedStorage;
  const usagePercent = Math.min((usedStorage / totalStorage) * 100);
  const availableStorage = totalStorage - usedStorage;

  const storageBreakdown = [
    {
      name: "Documents",
      size: usedStorage * 0.25,
      color: "bg-primary",
      icon: "📄",
      files: [
        { name: "PDFs", size: usedStorage * 0.15 },
        { name: "Word Docs", size: usedStorage * 0.07 },
        { name: "Spreadsheets", size: usedStorage * 0.03 },
      ],
    },
    {
      name: "Photos & Videos",
      size: usedStorage * 0.45,
      color: "bg-accent",
      icon: "🎬",
      files: [
        { name: "Videos", size: usedStorage * 0.30 },
        { name: "Photos", size: usedStorage * 0.15 },
      ],
    },
    {
      name: "Archives",
      size: usedStorage * 0.20,
      color: "bg-black",
      icon: "📦",
      files: [
        { name: "Backups", size: usedStorage * 0.12 },
        { name: "ZIP Files", size: usedStorage * 0.08 },
      ],
    },
    {
      name: "Other",
      size: usedStorage * 0.10,
      color: "bg-gray-400",
      icon: "📁",
      files: [
        { name: "Cache", size: usedStorage * 0.06 },
        { name: "Temporary", size: usedStorage * 0.04 },
      ],
    },
  ];

  return (
    <div className="bg-[#F7F5F2] rounded-2xl p-8 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <HardDrive className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Storage Usage
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your storage across devices
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {usagePercent?.toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground">Full</p>
        </div>
      </div>

      {/* Capacity Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-secondary rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Used Storage</p>
          <p className="text-lg font-bold text-foreground">
            {formatSize(usedStorage)} 
          </p>
        </div>
        <div className="bg-secondary rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Available</p>
          <p className="text-lg font-bold">
            {formatSize(availableStorage)} 
          </p>
        </div>
        <div className="bg-secondary rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Capacity</p>
          <p className="text-lg font-bold text-foreground">
            {formatSize(totalStorage)} 
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-[#155dfc] from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {formatSize(availableStorage)}  remaining before reaching capacity
        </p>
      </div>

      {/* Storage Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Storage by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storageBreakdown.map((category, index) => (
            <div key={category.name} className="flex flex-col">
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === index ? null : index)
                }
                className="w-full flex items-center justify-between p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors h-full"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-4 h-4 rounded-full ${category.color} shrink-0`} />
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">
                      {category.icon} {category.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {usedStorage > 0 ? ((category.size / usedStorage) * 100).toFixed(1) : "0.0"}% of
                      used storage
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="font-bold text-foreground">
                    {formatSize(category.size)} 
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      expandedCategory === index ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Details */}
              {expandedCategory === index && (
                <div className="ml-6 mt-2 space-y-2 border-l-2 border-border pl-4">
                  {category.files.map((file) => (
                    <div
                      key={file.name}
                      className="flex justify-between items-center py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>└ {file.name}</span>
                      <span className="font-medium">
                        {formatSize(file.size)} 
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="gap-2 border-border hover:bg-secondary"
        >
          <Download className="w-4 h-4" />
          Download Usage Report
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-border text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
          Optimize Storage
        </Button>
      </div>
    </div>
  );
}
