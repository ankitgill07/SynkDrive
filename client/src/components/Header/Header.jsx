import React, { useState } from "react";
import { Bell, Cloud, UserPlus, Shield, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { userAuth } from "@/contextApi/AuthContext";
import { IoIosSearch } from "react-icons/io";
import SideBare from "../Sidebare/SideBare";
import { useForm } from "react-hook-form";
import SearchPage from "@/Pages/SearchPage";

function Header({ user, onMenuClick }) {
  const [openSearchPage, setOpenSearchPage] = useState(false);

  return (
    <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-256px)] h-16 lg:h-[72px] bg-white border-b border-border/30 z-40 flex items-center">
      <header className="w-full px-4 sm:px-6 py-0">
        <div className="w-full flex justify-between items-center">
          <div className="flex-1 max-w-md flex items-center gap-2 sm:gap-3 relative mr-2 sm:mr-4">
            {/* Hamburger Menu trigger visible only on mobile/tablet */}
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0 transition-colors"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <SearchPage />
            </div>
          </div>
          <div className="flex gap-x-2 sm:gap-x-3 items-center justify-end shrink-0">
            {user?.hasActiveSubscription || user?.subscriptionsId || (user?.subscriptionStatus && user?.subscriptionStatus !== "free" && user?.subscriptionStatus !== "cancelled") ? (
              <Link to="/drive/subscription" className="hidden sm:inline-block">
                <button className="bg-blue-50 text-[#155dfc] border border-blue-200 flex items-center rounded-md cursor-pointer font-bold px-3 sm:px-4 py-2 text-xs sm:text-sm font-plusjakartaSans hover:bg-[#155dfc] hover:text-white duration-300 shrink-0">
                  <span>Manage Subscription</span>
                </button>
              </Link>
            ) : (
              <Link to="/plan" className="hidden sm:inline-block">
                <button className="bg-[#d9d4cc3b] flex items-center rounded-md cursor-pointer font-bold px-3 sm:px-4 py-2 text-xs sm:text-sm font-plusjakartaSans hover:bg-[#155dfc] duration-300 hover:text-white shrink-0">
                  <span>Click to upgrade</span>
                </button>
              </Link>
            )}
            {(() => {
              const role = (user?.role || '').toLowerCase();
              const isAdminLike = ['admin'].includes(role);
              const isManager = ['manager', 'manger'].includes(role);
              if (isAdminLike || isManager) {
                return (
                  <Link to="/admin/dashboard" className="hidden md:inline-block">
                    <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white flex items-center rounded-md cursor-pointer font-bold px-4 py-2 text-xs sm:text-sm font-plusjakartaSans hover:from-violet-600 hover:to-purple-700 duration-300 shadow-md">
                      <Shield size={16} className="mr-1.5" />
                      <span>{isAdminLike ? 'Admin' : 'Manager'} Dashboard</span>
                    </button>
                  </Link>
                );
              }
              return null;
            })()}
            <button className=" cursor-pointer p-1.5 rounded-full hover:bg-slate-100 transition-colors shrink-0">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <Link to={"/drive/profile"}>
              <div className=" flex items-center hover:bg-[#d9d4cc3b] px-1 sm:px-3 py-2 rounded-md  cursor-pointer ">
                <div className=" sm:mr-2 shrink-0">
                  <img
                     className="w-8 h-8 object-cover rounded-full "
                     src={user.picture}
                     alt=""
                  />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <p className=" font-inter font-medium text-xs leading-none mb-0.5 ">{user.name}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#155dfc] border border-blue-150 uppercase tracking-wide inline-block w-fit scale-90 -translate-x-1">
                    {(() => {
                      if (!user) return "Free";
                      const planId = user.planId || "free";
                      if (planId === "plan_Si1gZRtrnRwauf") return "Basic";
                      if (planId === "plan_ShbAnQqzVwui43") return "Pro";
                      if (planId === "plan_Si1g6y6HLTrVjZ") return "Premium";
                      return "Free";
                    })()}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
