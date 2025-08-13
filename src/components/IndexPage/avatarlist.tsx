import { RootState } from "@/store/store";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface AvatarListProps {
  users: User[];
  onClick?: () => void;
  selectedUserIds?: any;
  setSelectedUserIds?: any;
  fetchKanbonList?: any;
}
export default function AvatarList({
  users = [],
  onClick,
  selectedUserIds,
  setSelectedUserIds,
  fetchKanbonList,
}: AvatarListProps) {
  const user: any = useSelector((state: RootState) => state.auth.user);

  const [imgErrors, setImgErrors] = useState<{ [userId: string]: boolean }>({});
  const [maxVisible, setMaxVisible] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMaxVisible = () => {
      setMaxVisible(window.innerWidth < 768 ? 3 : 5);
    };
    updateMaxVisible();
    window.addEventListener("resize", updateMaxVisible);
    return () => window.removeEventListener("resize", updateMaxVisible);
  }, []);

  const toggleUserSelection = (userId: string) => {
    const updatedSelection = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id: any) => id !== userId)
      : [...selectedUserIds, userId];

    setSelectedUserIds(updatedSelection);
    fetchKanbonList(updatedSelection);
  };

  const handleImgError = (userId: string) => {
    setImgErrors((prev) => ({ ...prev, [userId]: true }));
  };

  const visibleUsers = users.slice(0, maxVisible);
  const hiddenUsers = users.slice(maxVisible);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
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
  return (
    <div onClick={onClick} ref={dropdownRef} className="cursor-pointer flex items-center space-x-2 relative">
      <ul className="list-stacked flex items-center">
        {visibleUsers.map((usr: any) => {
          const initials =
            usr.username?.slice(0, 2).toUpperCase() ||
            usr.firstName?.slice(0, 2).toUpperCase();
          const isActive = selectedUserIds?.includes(usr._id);
          const hasImgError = imgErrors[usr._id];
          const profileImageUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}${usr?.profileImage}`;
          return (
            <div key={usr._id}>
              <div
                title={`${usr.firstName} ${usr.lastName}`}
                onClick={onClick ? onClick : () => toggleUserSelection(usr._id)}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold transition 
                 ${isActive ? "bg-green-600 scale-110 shadow-md" : "bg-blue-500"}`}
              >
                {!hasImgError && usr?.profileImage ? (
                  <img
                    src={profileImageUrl}
                    alt={`${usr?.firstName || ""} ${usr?.lastName || ""}`}
                    width={25}
                    height={25}
                    className="w-[25px] h-[25px] rounded-full object-cover"
                    onError={() => handleImgError(usr._id)}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
            </div>
          );
        })}
      </ul>

      {hiddenUsers.length > 0 && (
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-black cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
        >
          •••
        </div>
      )}

      {dropdownOpen && hiddenUsers.length > 0 && (
        <div className="absolute right-0 top-10 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2 flex flex-wrap gap-2 z-50">
          {hiddenUsers.map((usr: any) => {
            const initials =
              usr.username?.slice(0, 2).toUpperCase() ||
              usr.firstName?.slice(0, 2).toUpperCase();
            const isActive = selectedUserIds?.includes(usr._id);
            const hasImgError = imgErrors[usr._id];
            const profileImageUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}${usr?.profileImage}`;
            return (
              <div
                key={usr._id}
                title={`${usr.firstName} ${usr.lastName}`}
                onClick={onClick ? onClick : () => toggleUserSelection(usr._id)}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold transition 
                  ${isActive ? "bg-green-600 scale-110 shadow-md" : "bg-blue-500"}`}
              >
                {!hasImgError && usr?.profileImage ? (
                  <img
                    src={profileImageUrl}
                    alt={`${usr?.firstName || ""} ${usr?.lastName || ""}`}
                    width={25}
                    height={25}
                    className="w-[25px] h-[25px] rounded-full object-cover"
                    onError={() => handleImgError(usr._id)}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
