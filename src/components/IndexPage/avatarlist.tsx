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
  setSelectedUserIds = () => {},
  fetchKanbonList = () => {},
}: AvatarListProps) {
  const user = useSelector((state: RootState) => state.auth.user);
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  const toggleUserSelection = (userId: string) => {
    const updatedSelection = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id) => id !== userId)
      : [...selectedUserIds, userId];

    setSelectedUserIds(updatedSelection);
    fetchKanbonList(updatedSelection);
  };

  const handleImgError = (userId: string) => {
    setImgErrors((prev) => ({ ...prev, [userId]: true }));
  };

  const visibleUsers = users.slice(0, maxVisible);

  return (
    <div
      onClick={onClick}
      ref={dropdownRef}
      className="relative flex items-center space-x-2"
    >
      {!dropdownOpen && (
        <ul className="flex items-center space-x-2">
          {visibleUsers.map((usr) => {
            const initials = usr.firstName?.slice(0, 2).toUpperCase() || "NA";
            const isActive = selectedUserIds.includes(usr._id);
            const hasImgError = imgErrors[usr._id];
            const profileImageUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}${usr?.avatar || usr?.profileImage || ""}`;

            return (
              <li key={usr._id}>
                <div
                  title={`${usr.firstName} ${usr.lastName}`}
                  onClick={() => toggleUserSelection(usr._id)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold transition cursor-pointer
                    ${
                      isActive
                        ? "bg-green-600 scale-110 shadow-md"
                        : "bg-blue-500 hover:bg-blue-600"
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
              </li>
            );
          })}
        </ul>
      )}

{users.length > maxVisible && (
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
      {dropdownOpen && (
        <div className="absolute right-0 top-10 z-50 w-[300px] max-h-[400px] overflow-auto bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="text-left py-2 px-3 border-b">Avatar</th>
                <th className="text-left py-2 px-3 border-b">Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usr) => {
                const initials = usr.firstName?.slice(0, 2).toUpperCase() || "NA";
                const hasImgError = imgErrors[usr._id];
                const profileImageUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}${usr?.avatar || usr?.profileImage || ""}`;
                return (
                  <tr
                    key={usr._id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => toggleUserSelection(usr._id)}
                  >
                    <td className="py-2 px-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs ${
                          selectedUserIds.includes(usr._id)
                            ? "bg-green-600"
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
