"use client";

import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  profileImage?: string;
}

interface AvatarListProps {
  users: User[];
  onClick?: () => void;
  selectedUserIds?: string[];
  setSelectedUserIds?: (ids: string[]) => void;
  fetchKanbonList?: (ids: string[]) => void;
}

export default function AvatarList({
  users = [],
  onClick,
  selectedUserIds = [],
  setSelectedUserIds = () => { },
  fetchKanbonList = () => { },
}: AvatarListProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [imgErrors, setImgErrors] = useState<{ [userId: string]: boolean }>({});
  const [maxVisible, setMaxVisible] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropUp, setDropUp] = useState(false);

  const checkSpace = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setDropUp(rect.bottom > 350);
    }
  };

  useEffect(() => {
    const updateMaxVisible = () => {
      setMaxVisible(window.innerWidth < 768 ? 3 : 5);
    };
    updateMaxVisible();
    window.addEventListener("resize", updateMaxVisible);
    return () => window.removeEventListener("resize", updateMaxVisible);
  }, []);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (dropdownOpen) {
      checkSpace();
      window.addEventListener("resize", checkSpace);
      window.addEventListener("scroll", checkSpace, true);
    }
    return () => {
      window.removeEventListener("resize", checkSpace);
      window.removeEventListener("scroll", checkSpace, true);
    };
  }, [dropdownOpen]);

  const toggleUserSelection = (userId: string) => {
    const updatedSelection = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id) => id !== userId)
      : [...selectedUserIds, userId];

    setSelectedUserIds(updatedSelection);
    fetchKanbonList(updatedSelection);
  };

  const handleAllClearUser = () => {
    setSelectedUserIds([]);
    fetchKanbonList([]);
  };

  const handleImgError = (userId: string) => {
    setImgErrors((prev) => ({ ...prev, [userId]: true }));
  };

  const AllUser = (users || [])
    .slice()
    .sort((a, b) =>
      a.firstName.localeCompare(b.firstName, "en", { sensitivity: "base" })
    );

  const visibleUsers = AllUser.slice(0, maxVisible);
  const selected =
    selectedUserIds.length > 0
      ? AllUser.filter((u) => selectedUserIds.includes(u._id))
      : [];
  const activeUsers = selected.slice(0, maxVisible);

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col items-center space-x-2"
    >
      <div className="flex justify-end">
        <ul className="flex items-end space-x-2">
          {(AllUser.length > maxVisible
            ? selectedUserIds.length > 0
              ? activeUsers
              : visibleUsers
            : visibleUsers
          ).map((usr) => {
            const initials =
              usr?.firstName?.slice(0, 2).toUpperCase() || "NA";
            const isActive = selectedUserIds.includes(usr?._id);
            const hasImgError = imgErrors[usr?._id];
            const profileImageUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}${usr?.avatar || usr?.profileImage || ""
              }`;
            return (
              <li key={usr?._id}>
                <div
                  title={`${usr?.firstName} ${usr?.lastName}`}
                  onClick={() => {
                    toggleUserSelection(usr?._id);
                    checkSpace(); // ✅ recalc on avatar click
                  }}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold transition cursor-pointer ${isActive
                    ? "bg-green-600 scale-110 shadow-md"
                    : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                  {!hasImgError && profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt={`${usr?.firstName} ${usr?.lastName}`}
                      className="w-[25px] h-[25px] rounded-full object-cover"
                      onError={() => handleImgError(usr?._id)}
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {users.length > maxVisible && (
          <div
            ref={triggerRef}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-black cursor-pointer ml-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!dropdownOpen) {
                checkSpace();
                setDropdownOpen(true);
              } else {
                setDropdownOpen(false);
              }
            }}
          >
            •••
          </div>
        )}
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className={`absolute right-0 z-50 w-[300px] max-h-[400px] overflow-auto bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4
            ${dropUp ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          <table className="min-w-full text-sm border-collapse">
            <thead>
              {selectedUserIds.length > 0 && (
                <tr>
                  <td className="px-1 py-2 border-none">
                    <div className="mb-2">
                      <span
                        className="bg-theme-primary text-white font-bold text-center px-3 py-2 rounded cursor-pointer"
                        onClick={handleAllClearUser}
                      >
                        Clear all
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </thead>
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="text-left py-2 px-3 border-b">Avatar</th>
                <th className="text-left py-2 px-3 border-b">Name</th>
              </tr>
            </thead>
            <tbody>
              {AllUser.map((usr) => {
                const initials =
                  usr.firstName?.slice(0, 2).toUpperCase() || "NA";
                const hasImgError = imgErrors[usr._id];
                const profileImageUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}${usr?.avatar || usr?.profileImage || ""
                  }`;
                return (
                  <tr
                    key={usr._id}
                    className={`transition cursor-pointer ${selectedUserIds.includes(usr._id)
                      ? "border-1 bg-green-500"
                      : ""
                      }`}
                    onClick={() => {
                      toggleUserSelection(usr._id);
                      checkSpace();
                    }}
                  >
                    <td className="py-2 px-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs ${selectedUserIds.includes(usr._id)
                          ? "bg-green-600 border-2"
                          : "bg-blue-500"
                          }`}
                      >
                        {!hasImgError && profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt={`${usr.firstName} ${usr.lastName}`}
                            className="w-[25px] h-[25px] rounded-full object-cover"
                            onError={() => handleImgError(usr._id)}
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-gray-800 font-medium">
                      {usr.firstName} {usr.lastName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
