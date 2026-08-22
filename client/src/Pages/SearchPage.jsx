import useFolder from "@/hooks/useFolder";
import { renderFilePreview } from "@/utils/Helpers";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { FaFolder } from "react-icons/fa";
import { IoIosSearch, IoMdClose } from "react-icons/io";

function SearchPage() {
  const [isActive, setIsActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
  const { handleOpen } = useFolder();

  // Retrieve loaded items from Redux store
  const items = useSelector((state) => state.folder.items) || [];

  // Filter items in frontend
  const searchResult = useMemo(() => {
    if (!searchInput.trim()) return [];
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [items, searchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {isActive && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsActive(false)}
        />
      )}
      <div className="w-full relative h-12 z-30">
        <div
          className={`
            absolute top-0 left-0 w-full 
            flex flex-col
            transition-all duration-200 ease-in-out
            ${
              isActive
                ? "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] rounded-[24px]"
                : "bg-[#E9EEF6] rounded-full"
            }
          `}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full h-12 px-2"
            onFocus={() => setIsActive(true)}
          >
            <div className="pl-1">
              <button
                type="button"
                className="p-2.5 rounded-full hover:bg-gray-200/50 text-gray-600 transition-colors"
              >
                <IoIosSearch size={22} />
              </button>
            </div>

            <input
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              value={searchInput}
              name="search"
              className="
                w-full bg-transparent outline-none 
                text-gray-700 text-[16px] font-normal font-inter
                placeholder:text-gray-500 px-2
              "
              placeholder="Search in Drive"
            />

            <div className=" gap-1">
              {isActive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsActive(false);
                    setSearchInput("");
                  }}
                  className="p-2 rounded-full hover:bg-gray-200/50 text-gray-600 transition-colors"
                >
                  <IoMdClose size={20} />
                </button>
              )}
            </div>
          </form>

          {isActive && (
            <div className="w-full bg-white rounded-b-[24px] pb-4 px-2 flex flex-col">
              <div className="border-t border-gray-100 mx-4 mb-2"></div>

              <p className="text-xs text-gray-500 px-4 py-2 font-medium">
                RECENT FILES
              </p>
              {searchResult.length > 0 ? (
                searchResult.map((data) => (
                  <div
                    key={data._id}
                    onClick={() => {
                      setIsActive(false);
                      setSearchInput("");
                      handleOpen(data);
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg mx-2 transition-colors"
                  >
                    <div>
                      {data?.type === "folder" ? (
                        <FaFolder size={22} className="text-[#3F8EFC] " />
                      ) : (
                        renderFilePreview({ file: data, size: 22 })
                      )}
                    </div>
                    <span className="text-sm text-gray-700">{data.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 px-4 py-2">No matching files or folders found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchPage;
