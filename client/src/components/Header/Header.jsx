import React, { useState } from "react";
import Container from "../container/container";
import { Bell, Cloud, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { userAuth } from "@/contextApi/AuthContext";
import { IoIosSearch } from "react-icons/io";
import SideBare from "../Sidebare/SideBare";
import { useForm } from "react-hook-form";
import SearchPage from "@/Pages/SearchPage";
function Header() {
  const { user } = userAuth();
  const [openSearchPage, setOpenSearchPage] = useState(false);

  return (
    <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] bg-white z-40">
      <header className="w-full px-5 py-3">
        <div className="w-full flex justify-between items-center">
          <div className="w-1/2 relative mr-4">
            <SearchPage open={openSearchPage} setOpen={setOpenSearchPage} />
          </div>
          <div className=" flex gap-x-3 items-center justify-end">
            <button className=" bg-[#d9d4cc3b] flex items-center    rounded-md cursor-pointer  font-bold  px-4 py-2  font-plusjakartaSans hover:bg-[#e9e8e8] duration-300 ">
              <UserPlus size={20} className="  mr-1.5 " />
              <span>Invite members</span>
            </button>
            <Link to={"/plain"}>
              <button className=" bg-[#d9d4cc3b] flex items-center   rounded-md cursor-pointer  font-bold  px-4 py-2  font-plusjakartaSans hover:bg-[#155dfc]  duration-300 hover:text-white ">
                <span>Click to upgrade</span>
              </button>
            </Link>
            <button className=" cursor-pointer ">
              {" "}
              <Bell />
            </button>
            <Link to={"/drive/profile"}>
              <div className=" flex items-center hover:bg-[#d9d4cc3b]   px-3 py-1 rounded-md  cursor-pointer ">
                <div className=" mr-2">
                  <img
                    className="w-8 h-8 object-cover rounded-full "
                    src={user.picture}
                    alt=""
                  />
                </div>
                <div>
                  <p className=" font-inter font-medium ">{user.name}</p>
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
