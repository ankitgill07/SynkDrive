import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { userAuth } from "@/contextApi/AuthContext";
import { setPasswordApi, updatePasswordApi } from "@/api/UserApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export function PasswordSection() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const toggleShow = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const { user, checkAuthorization } = userAuth();

  const password = watch("password");

  const handlPasswordSubmit = async (data) => {
    const result = user.manualLogin
      ? await updatePasswordApi(data)
      : await setPasswordApi(data.password);
    if (result.success) {
      checkAuthorization();
      toast.success(result.data);
    }
  };

  return (
    <Card className="p-8 bg-[#F7F5F2] gap-3 rounded-xl border border-border">
      <h2 className="text-2xl font-semibold text-foreground mb-2 font-plusjakartaSans ">
        Set Password
      </h2>
      <p className="text-muted-foreground text-sm mb-2 font-inter ">
        Update your password for manual login to your account
      </p>
      <form
        onSubmit={handleSubmit(handlPasswordSubmit)}
        className="space-y-6 font-inter "
      >
        {user.manualLogin && (
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-foreground">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                placeholder="Enter current password"
                {...register("currentPassword")}
                className="pr-10 bg-white border-border text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => toggleShow("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">
            {user.manualLogin ? "New Password" : "Password"}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPasswords.new ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="pr-10 bg-white border-border text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => toggleShow("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.new ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 pt-1  text-sm  font-medium font-inter">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-foreground">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Confirm new password"
              name="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="pr-10 bg-white border-border text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => toggleShow("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 pt-1  text-sm  font-medium font-inter">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            className="bg-[#155dfc] text-white  hover:bg-[#155dfc]/90"
          >
            {user.manualLogin ? "Update Password" : "Set Password"}
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
