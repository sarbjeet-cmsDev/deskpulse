
import { RootState } from "@/store/store";
import Image from "next/image";
import { useState } from "react";
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
  return (
    <div onClick={onClick} className="cursor-pointer">
      <ul className="list-stacked flex items-center">
        {users?.map((usr: any) => {
          const initials = usr.username?.slice(0, 2).toUpperCase() || usr.firstName?.slice(0, 2).toUpperCase();
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
    </div>
  );
}
