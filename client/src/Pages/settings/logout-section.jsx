import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { logoutDevicesBySidApi, logoutForAllDeviceApi } from "@/api/UserApi";
import { toast } from "sonner";

export function LogoutSection({ profile, handleProfile }) {
  const handelSelectedDevice = async (sid) => {
    const result = await logoutDevicesBySidApi(sid);
    if (result.success) {
      handleProfile();
      toast.success(result.data);
    } else {
      toast.error(result.date);
    }
  };

  const handleLogoutForAllDevice = async () => {
    const result = await logoutForAllDeviceApi();
    if (result.success) {
      toast.success(result.data);
    } else {
      toast.error(result.date);
    }
  };

  return (
    <Card className="p-8 gap-3 bg-[#F7F5F2] rounded-xl border border-border">
      <h2 className="text-2xl font-semibold text-foreground  font-plusjakartaSans">
        Active Sessions
      </h2>
      <p className="text-muted-foreground text-sm  font-inter">
        Manage your logged-in devices and sessions
      </p>
      <div className="space-y-4 mb-8">
        {profile?.sessions?.map(
          ({ sessionId, deviceName, os, isCurrent, lastActive }) => (
            <div
              key={sessionId}
              className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:border-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">
                      {deviceName}
                    </h3>
                    {isCurrent && (
                      <Badge className="bg-accent/20 text-accent border-0">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {os} • Last active{" "}
                    {new Date(lastActive).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handelSelectedDevice(sessionId)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                Logout
              </Button>
            </div>
          ),
        )}
      </div>

      <div className="bg-secondary rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <LogOut className="w-5 h-5 text-primary mt-0.5 " />
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-2">
              Logout All Devices
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Logging out from all devices will sign you out of every active
              session. You'll need to sign in again on each device.
            </p>
            <Button
              onClick={handleLogoutForAllDevice}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout All Devices
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
