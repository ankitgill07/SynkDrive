import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Camera } from "lucide-react";
import { userAuth } from "@/contextApi/AuthContext";
import { updatedProfileApi } from "@/api/UserApi";

export function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, checkAuthorization } = userAuth();
  const [name, setName] = useState(user.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [selectImage, setSelectImage] = useState(user.picture || null);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.picture);
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(avatarUrl);
  const fileInputRef = useRef(null);

  const handleEdit = () => {
    setIsEditing(true);
    setTempName(name);
    setTempEmail(email);
    setTempAvatarUrl(avatarUrl);
  };

  const handleCancel = () => {
    setTempName(name);
    setTempEmail(email);
    setTempAvatarUrl(avatarUrl);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      (formData.append("name", tempName), formData.append("file", selectImage));
      const result = await updatedProfileApi(formData);
      if (result.success) {
        setName(tempName);
        setEmail(tempEmail);
        setAvatarUrl(tempAvatarUrl);
        setIsEditing(false);
        await checkAuthorization();
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempAvatarUrl(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#F7F5F2] rounded-2xl p-8 md:p-12 border border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        <div className="relative group">
          <Avatar className="w-32 h-32 border-2 border-border">
            <AvatarImage
              src={isEditing ? tempAvatarUrl : avatarUrl}
              className="object-cover "
            />
            <AvatarFallback className="bg-black capitalize text-white text-2xl font-bold">
              {user.name}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Content Section */}
        {isEditing ? (
          <div className="flex-1 space-y-4 font-inter w-full">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your full name"
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-border"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                className="bg-[#155dfc] text-white hover:bg-[#155dfc]/90 gap-2"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-border"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <h1 className="text-3xl font-plusjakartaSans  md:text-4xl font-bold text-foreground mb-2">
              {name}
            </h1>
            <p className="text-muted-foreground text-base mb-4 font-inter ">
              {email}
            </p>
            <div className="flex flex-col gap-2 font-inter ">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Account Status:
                </span>
                <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                  Premium
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Member since January 2024 •{" "}
                {(parseFloat(email.split("@")[0].length * 1.23) % 365).toFixed(
                  0,
                )}{" "}
                storage units used
              </p>
            </div>
          </div>
        )}

        {!isEditing && (
          <Button
            onClick={handleEdit}
            className="bg-[#155dfc] text-white hover:bg-[#155dfc]/90 whitespace-nowrap"
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}
