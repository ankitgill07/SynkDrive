"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteAccountPermanentlyApi, disableAccountApi } from "@/api/UserApi";
import { toast } from "sonner";

export function AccountManagement() {
  const [disableOpen, setDisableOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handeDisableAccount = async () => {
    const result = await disableAccountApi();
    if (result.success) {
      toast.success(result.data);
    } else {
      toast.error(result.message);
    }
  };

  const handelDeleteAccount = async () => {
    const result = await deleteAccountPermanentlyApi();
    if (result.data) {
      toast.success(result.data);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card className="p-8 bg-[#f7f5f2] rounded-xl border border-border">
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Account Settings
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Manage your account status and data
      </p>

      <div className="space-y-4">
        <div className="bg-secondary rounded-lg p-6 border border-border hover:border-accent/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center ">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                Disable Your Account
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Temporarily disable your account. You can reactivate it anytime
                by logging back in. Your data will be preserved.
              </p>
              <AlertDialog open={disableOpen} onOpenChange={setDisableOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={handeDisableAccount}
                    variant="outline"
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                  >
                    Disable Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">
                      Disable Your Account?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      Your account will be temporarily disabled. You can
                      reactivate it anytime by logging back in. All your data
                      will remain safe.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary text-foreground border-border hover:bg-secondary/80">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Disable
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-6 border border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center ">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Permanently Delete Account
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone. Please download your data before
                proceeding.
              </p>
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 dark:text-red-400">
                      Permanently Delete Account?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground space-y-3">
                      <div>
                        <p className="font-medium text-foreground">
                          This action cannot be undone.
                        </p>
                        <p>
                          All your data will be permanently deleted including:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                          <li>Profile information</li>
                          <li>Connected accounts</li>
                          <li>Account history</li>
                          <li>All personal data</li>
                        </ul>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary text-foreground border-border hover:bg-secondary/80">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handelDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">
                      Yes, Delete Forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
