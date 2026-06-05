import { STEPS } from "@/layout/SubscriptionLayout";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function Navbar({ currentStep}) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={"/drive/home"}>
          <div className=" flex items-center px-3 group cursor-pointer ">
            <div className="">
              <img
                className=" w-10 h-10 rounded-md object-cover "
                src={logo}
                alt=""
              />
            </div>
            <p className=" font-bold font-plusjakartaSans text-xl ml-2 text-[#1F2933] ">
              SynkDrive
            </p>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-1">
          {STEPS?.map((label, idx) => {
            const step = idx + 1;
            const done = step < currentStep;
            const active = step === currentStep;
            return (
              <div key={label} className="flex items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`
                    w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition-all
                    ${
                      done
                        ? "bg-green-500 text-white"
                        : active
                          ? "bg-[#155dfc] text-white shadow shadow-blue-300"
                          : "bg-gray-100 text-gray-400"
                    }
                  `}
                  >
                    {done ? "✓" : step}
                  </span>
                  <span
                    className={`text-xs font-semibold transition-colors
                    ${
                      done
                        ? "text-green-500"
                        : active
                          ? "text-[#155dfc]"
                          : "text-gray-300"
                    }
                  `}
                  >
                    {label}
                  </span>
                </div>
                {idx < STEPS?.length - 1 && (
                  <span className="text-gray-200 mx-1 text-xs">──</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#155dfc] flex items-center justify-center text-white text-sm font-black cursor-pointer hover:bg-blue-700 transition-colors shadow shadow-blue-200">
          U
        </div>
      </div>
    </nav>
  );
}
