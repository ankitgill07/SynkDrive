import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Settings, LogOut } from "lucide-react";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { userAuth } from "@/contextApi/AuthContext";

export function TopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = userAuth();
  return (
    <header className="fixed w-full   top-0 z-50 border-b   bg-white opacity-98  ">
      <div className="w-full px-6 py-2">
        <div className="flex items-center justify-between">
          <Link to="/drive/home">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 ">
                <img
                  className="w-full h-full  rounded-md object-cover "
                  src={logo}
                  alt=""
                />
              </div>
              <h1 className="font-bold font-plusjakartaSans text-xl  text-[#1F2933]">
                SynkDrive
              </h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Premium</p>
                </div>
                <Avatar className="w-10 h-10 border-2 border-border">
                  <AvatarImage src={user.picture} className="object-cover " />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-semibold text-foreground">John Doe</p>
                    <p className="text-sm text-muted-foreground">
                      john.doe@example.com
                    </p>
                  </div>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-foreground hover:bg-secondary transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 transition-colors border-t border-border">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
