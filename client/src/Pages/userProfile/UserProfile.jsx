import React, { useEffect, useState } from "react";
import { userAuth } from "@/contextApi/AuthContext";
import { getUserProfileApi } from "@/api/UserApi";
import { TopHeader } from "../settings/top-header";
import { ProfileHeader } from "../settings/profile-header";
import { StorageUsage } from "../settings/storage-usage";
import { SocialConnections } from "../settings/social-connections";
import { PasswordSection } from "../settings/password-section";
import { AccountManagement } from "../settings/account-management";
import { LogoutSection } from "../settings/logout-section";

const UserProfile = () => {
  const { user, checkAuthorization } = userAuth();
  const [profile, setProfile] = useState([]);

  const handleProfile = async () => {
    const result = await getUserProfileApi();
    console.log(result);
    setProfile(result);
  };

  useEffect(() => {
    handleProfile();
  }, []);

  return (
    <div className=" bg-white ">
      <section className=" mb-30 w-full relative   ">
        <TopHeader />
      </section>
      <div className="max-w-6xl mx-auto ">
        <section className=" mb-8 ">
          <ProfileHeader />
        </section>
        <section className=" mb-8 ">
          <StorageUsage />
        </section>
        {profile.socialProvider  && (
          <section className=" mb-8 ">
            <SocialConnections />
          </section>
        )}
        <section className=" mb-8 ">
          <PasswordSection />
        </section>
        <section className=" mb-8 ">
          <LogoutSection profile={profile} handleProfile={handleProfile} />
        </section>
        <section className=" mb-8 ">
          <AccountManagement />
        </section>
      </div>
    </div>
  );
};
export default UserProfile;
