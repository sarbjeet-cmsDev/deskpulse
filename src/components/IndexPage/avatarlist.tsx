import Image from "next/image";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;  
}

interface AvatarListProps {
  users: User[];
  onClick?: () => void;
}

export default function AvatarList({ users = [], onClick }: AvatarListProps) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <ul className="list-stacked flex items-center">
        {users.map((user, index) => (
          <li key={user._id} className={`avt-list ${index !== 0 ? 'ml-[-4px]' : ''}`}>
            <div className="avatar avt-27 round">
              <Image
                src={user.avatar || '/default-avatar.png'}  
                alt={`${user.firstName} ${user.lastName}`}
                width={25}
                height={25}
                className="w-[25px] h-[25px] rounded-full object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
