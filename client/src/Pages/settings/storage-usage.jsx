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
      size: 85.2,
      color: "bg-primary",
      icon: "📄",
      files: [
        { name: "PDFs", size: 45.2 },
        { name: "Word Docs", size: 25.0 },
        { name: "Spreadsheets", size: 15.0 },
      ],
    },
    {
      name: "Photos & Videos",
      size: 120.5,
      color: "bg-accent",
      icon: "🎬",
      files: [
        { name: "4K Videos", size: 75.0 },
        { name: "Photos", size: 35.5 },
        { name: "Thumbnails", size: 10.0 },
      ],
    },
    {
      name: "Archives",
      size: 25.1,
      color: "bg-black",
      icon: "📦",
      files: [
        { name: "Backups", size: 15.0 },
        { name: "ZIP Files", size: 10.1 },
      ],
    },
    {
      name: "Other",
      size: 15.0,
      color: "bg-gray-400",
      icon: "📁",
      files: [
        { name: "Cache", size: 8.0 },
        { name: "Temporary", size: 7.0 },
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
      <div className="grid grid-cols-3 gap-4 mb-8">
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
        <div className="space-y-3">
          {storageBreakdown.map((category, index) => (
            <div key={category.name}>
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === index ? null : index)
                }
                className="w-full flex items-center justify-between p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <div className="text-left">
                    <p className="font-medium text-foreground">
                      {category.icon} {category.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((category.size / usedStorage) * 100).toFixed(1)}% of
                      used storage
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground">
                    {category.size.toFixed(1)} 
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
                        {file.size.toFixed(1)} 
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
