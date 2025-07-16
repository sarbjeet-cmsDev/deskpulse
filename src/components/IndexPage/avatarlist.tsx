import { RootState } from "@/store/store";
import Image from "next/image";
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

  const toggleUserSelection = (userId: string) => {
    const updatedSelection = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id: any) => id !== userId)
      : [...selectedUserIds, userId];

    setSelectedUserIds(updatedSelection);
    fetchKanbonList(updatedSelection);
  };
  return (
    <div onClick={onClick} className="cursor-pointer">
      <ul className="list-stacked flex items-center">
        {users?.map((usr: any) => {
          const profileImageUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}${usr?.profileImage}`;
          const initials = usr.username?.slice(0, 2).toUpperCase();
          const isActive = selectedUserIds.includes(usr._id);

          return (
            <div key={usr._id}>
              <div
                title={usr.username}
                onClick={() => {
                  toggleUserSelection(usr._id);
                }}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold transition 
        ${isActive ? "bg-green-600 scale-110 shadow-md" : "bg-blue-500"}`}
              >
                {usr?.profileImage ? (
                  <img
                    src={profileImageUrl}
                    alt={`${usr?.firstName || ""} ${usr?.lastName || ""}`}
                    width={25}
                    height={25}
                    className="w-[25px] h-[25px] rounded-full object-cover"
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
