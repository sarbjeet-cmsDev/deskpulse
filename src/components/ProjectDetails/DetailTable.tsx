"use client";
import AvatarList from "@/components/IndexPage/avatarlist";
import avatar from "@/assets/images/avt1.jpg";
import Image from "next/image";
import DatePickerInput from "@/components/ProjectDetails/Datepicker";
import { Input } from "../Form/Input";
import { useRef, useState } from "react";
import MentionUserListModal from "@/components/MentionUserListBox";
import TaskService, { ITask } from "@/service/task.service";
import Swal from "sweetalert2";
import NotificationService from "@/service/notification.service";
import MultiSelectUserModal from "../Form/MultiSelectUserModal";
import AdminProjectService from "@/service/adminProject.service";
import { getSocket } from "@/utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface DetailsProps {
  project: {
    team?: any[];
    leader?: {
      name: string;
      avatar: string;
    };
    status?: string;
    dueDate?: string;
    attachments?: string[];
  };
  projectId: string;
  user: any;
  onTaskUpdate: () => void;
}

export default function Details({
  project,
  projectId,
  user,
  onTaskUpdate,
}: DetailsProps) {
  const [email, setEmail] = useState("");
  const [teamUserIds, setTeamUserIds] = useState(
    project.team?.map((u) => u._id) || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const loginUser: any = useSelector((state: RootState) => state.user.data);

  const {
    team = [],
    leader,
    status = "To Do",
    dueDate,
    attachments = [],
  } = project || [];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const socketRef = useRef(getSocket());

  const handleUserUpdate = async (updatedIds: string[]) => {
    try {
      await AdminProjectService.updateProject(projectId, {
        users: updatedIds,
        is_active: true,
      });
      const newUserIds = updatedIds.filter((id) => !teamUserIds.includes(id));

      if (newUserIds.length) {
        if (!socketRef.current.connected) {
          socketRef.current.connect();
        }

        socketRef.current.on("connect", () => {
          socketRef.current.emit("register-user", loginUser.id);
        });

        newUserIds.forEach((id) => {
          socketRef.current.emit("task-updated", {
            taskId: "1111",
            sender: `${loginUser.firstName} ${loginUser.lastName}`,
            receiverId: id,
            description: "Assigned You a Project",
          });
        });

        console.log("✅ socket event 'task-updated' sent for new users:", newUserIds);
      }

      setTeamUserIds(updatedIds); // update state AFTER handling sockets
      onTaskUpdate?.();
    } catch (err) {
      console.error("Failed to update project users", err);
    }
  };


  return (
    <div>
      <ul className="mt-[24px]">
        <li className="">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-4 w-[35%]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.9">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.90566 12.0116L9.99976 12.0116L10.2102 12.0123C11.8191 12.0229 15.4957 12.1854 15.4957 14.6774C15.4957 17.153 11.9472 17.3145 10.2353 17.325L9.60107 17.325C7.99215 17.3144 4.31483 17.1521 4.31483 14.6632C4.31483 12.1845 7.99215 12.0229 9.60107 12.0123L9.81157 12.0116C9.84422 12.0116 9.87561 12.0116 9.90566 12.0116ZM9.90566 13.2616C7.92566 13.2616 5.56483 13.5049 5.56483 14.6632C5.56483 15.7954 7.78475 16.0601 9.72469 16.0751L9.90566 16.0758C11.8857 16.0758 14.2457 15.8333 14.2457 14.6774C14.2457 13.5074 11.8857 13.2616 9.90566 13.2616ZM16.5337 11.6734C18.5528 11.9759 18.977 12.9243 18.977 13.6667C18.977 14.1201 18.7987 14.9476 17.607 15.4017C17.5337 15.4292 17.4587 15.4426 17.3845 15.4426C17.1328 15.4426 16.8953 15.2892 16.8003 15.0401C16.677 14.7176 16.8395 14.3559 17.162 14.2334C17.727 14.0184 17.727 13.7809 17.727 13.6667C17.727 13.3018 17.2628 13.0468 16.3478 12.9101C16.007 12.8584 15.7712 12.5409 15.822 12.1984C15.8728 11.8568 16.1895 11.6293 16.5337 11.6734ZM3.9885 12.1984C4.03933 12.5409 3.8035 12.8584 3.46266 12.9101C2.54766 13.0468 2.0835 13.3018 2.0835 13.6667C2.0835 13.7809 2.0835 14.0176 2.64933 14.2334C2.97183 14.3559 3.13433 14.7176 3.011 15.0401C2.916 15.2892 2.6785 15.4426 2.42683 15.4426C2.35266 15.4426 2.27766 15.4292 2.20433 15.4017C1.01183 14.9467 0.833496 14.1193 0.833496 13.6667C0.833496 12.9251 1.25766 11.9759 3.27766 11.6734C3.62183 11.6301 3.93683 11.8568 3.9885 12.1984ZM9.90566 3.33325C12.0057 3.33325 13.7132 5.04158 13.7132 7.14075C13.7132 9.23992 12.0057 10.9483 9.90566 10.9483H9.88316C8.8665 10.9449 7.914 10.5466 7.20066 9.82658C6.48566 9.10742 6.09483 8.15242 6.09896 7.13825C6.09896 5.04158 7.8065 3.33325 9.90566 3.33325ZM9.90566 4.58325C8.49566 4.58325 7.34898 5.73075 7.34898 7.14075C7.3465 7.82408 7.60816 8.46325 8.08733 8.94575C8.5665 9.42825 9.20483 9.69575 9.88483 9.69825L9.90566 10.3233V9.69825C11.3157 9.69825 12.4632 8.55158 12.4632 7.14075C12.4632 5.73075 11.3157 4.58325 9.90566 4.58325ZM15.0632 4.1495C16.5282 4.39034 17.5923 5.64367 17.5923 7.1295C17.589 8.62533 16.4715 9.90867 14.9923 10.1162C14.9632 10.1203 14.934 10.122 14.9057 10.122C14.599 10.122 14.3315 9.89617 14.2873 9.58367C14.2398 9.24117 14.4773 8.92533 14.8198 8.87783C15.6865 8.75617 16.3407 8.0045 16.3423 7.12783C16.3423 6.25867 15.719 5.52367 14.8598 5.38283C14.5198 5.327 14.289 5.00533 14.3448 4.6645C14.4015 4.32367 14.7207 4.09534 15.0632 4.1495ZM5.4665 4.6645C5.52233 5.00533 5.2915 5.327 4.9515 5.38283C4.09233 5.52367 3.469 6.25867 3.469 7.1295C3.47066 8.0045 4.12483 8.757 4.99066 8.87783C5.33316 8.92533 5.57066 9.24117 5.52316 9.58367C5.479 9.89617 5.2115 10.122 4.90483 10.122C4.8765 10.122 4.84733 10.1203 4.81816 10.1162C3.339 9.90867 2.22233 8.62533 2.219 7.13117C2.219 5.64367 3.28316 4.39034 4.74816 4.1495C5.099 4.0945 5.40983 4.32534 5.4665 4.6645Z"
                    fill="#31394F"
                  />
                </g>
              </svg>
              <span className="text-[#31394f] text-[14px] leading-[16px]">
                Team Member
              </span>
            </div>
            <div className="flex items-center gap-2">
              {user.length === 0 ? (
                <div
                  className="add-member"
                  onClick={() => setIsUserModalOpen(true)}
                >
                  <a
                    href="#"
                    className="text-[#7980ff] border border-[#7980ff] px-[2px] rounded-[2px] text-[10px]"
                  >
                    +
                  </a>
                </div>
              ) : (
                <AvatarList
                  users={user}
                  onClick={() => setIsUserModalOpen(true)}
                />
              )}
              <MultiSelectUserModal
                activeUsers={user}
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                selectedUserIds={teamUserIds}
                onConfirm={handleUserUpdate}
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
