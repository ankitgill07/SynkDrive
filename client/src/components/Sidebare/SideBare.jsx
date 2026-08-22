import React from "react";
import logo from "../../assets/images/logo.png";
import { Image, LayoutDashboard, Star, Trash, Users, Shield, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { userAuth } from "@/contextApi/AuthContext";
import StorageUsage from "../storage/StorageUsage";

function SideBare({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = userAuth();

  const SideBareItems = [
    {
      name: "home",
      path: "/drive/home",
      svg: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      name: "photos",
      path: "/drive/photos",
      svg: <Image className="w-5 h-5 shrink-0" />,
    },
    {
      name: "shared files",
      path: "/drive/shared-files",
      svg: <Users className="w-5 h-5 shrink-0" />,
    },
    {
      name: "favorite",
      path: "/drive/favorite",
      svg: <Star className="w-5 h-5 shrink-0" />,
    },
    {
      name: "recycle bin",
      path: "/drive/recycle-bin",
      svg: <Trash className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          w-64 h-screen fixed top-0 left-0 bg-[#F7F5F2] border-r border-border/30 z-50
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="w-full h-full flex flex-col justify-between px-4 py-5 relative">
          
          {/* Mobile Close Button */}
          {isOpen && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#736c64] hover:bg-[#E5DED6] hover:text-[#1B1B1B] lg:hidden transition-colors"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div>
            {/* Logo */}
            <div
              onClick={() => window.location.reload()}
              className="flex items-center px-2 group cursor-pointer mb-6"
            >
              <div className="shrink-0">
                <img
                  className="w-9 h-9 rounded-md object-cover"
                  src={logo}
                  alt="Logo"
                />
              </div>
              <p className="font-bold font-plusjakartaSans text-lg ml-2 text-[#1F2933]">
                SynkDrive
              </p>
            </div>

            {/* Navigation */}
            <nav className="w-full py-2">
              <ul className="w-full space-y-1">
                {SideBareItems.map((data, index) => (
                  <li key={index}>
                    <Link to={`${data.path}`} onClick={onClose}>
                      <span
                        className={`w-full hover:bg-[#E5DED6] px-3 py-2.5 capitalize cursor-pointer rounded-md font-inter font-medium flex items-center hover:text-[#1B1B1B] duration-300 ${
                          location.pathname === data.path 
                            ? "bg-[#E5DED6] text-[#1B1B1B]" 
                            : "bg-transparent text-[#736c64]"
                        }`}
                      >
                        {data.svg}
                        <span className="ml-3 text-sm">{data.name}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Admin/Manager Routes */}
              {(() => {
                const role = (user?.role || '').toLowerCase();
                const hasAdminAccess = ['admin', 'manager', 'manger'].includes(role);
                if (hasAdminAccess) {
                  return (
                    <div className="mt-4 pt-4 border-t border-[#E5DED6]">
                      <Link to="/admin/dashboard" onClick={onClose}>
                        <span className="w-full hover:bg-[#E5DED6] px-3 py-2.5 capitalize cursor-pointer rounded-md font-inter font-medium flex items-center hover:text-[#1B1B1B] duration-300 bg-transparent text-[#736c64]">
                          <Shield className="w-5 h-5 shrink-0" />
                          <span className="ml-3 text-sm">
                            {['admin'].includes(role) ? 'Admin Dashboard' : 'Manager Dashboard'}
                          </span>
                        </span>
                      </Link>
                    </div>
                  );
                }
                return null;
              })()}
            </nav>
          </div>

          <div className="mt-auto pt-4">
            <StorageUsage />
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBare;
