"use client";
import AvatarList from "@/components/IndexPage/avatarlist";
import { useRef, useState } from "react";
import MultiSelectUserModal from "../Form/MultiSelectUserModal";
import { getSocket } from "@/utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AssigneeIcon } from "../icons";
import ProjectService from "@/service/project.service";

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
  const [teamUserIds, setTeamUserIds] = useState(
    project.team?.map((u) => u._id) || []
  );

  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const loginUser: any = useSelector((state: RootState) => state.user.data);

  const socketRef = useRef(getSocket());

  const handleUserUpdate = async (updatedIds: string[]) => {
    try {
      const oldProjectDetails = await ProjectService.getProjectById(projectId);
      const oldUsers = oldProjectDetails?.users;

      const updatedProject = await ProjectService.updateProject(projectId, {
        users: updatedIds,
        is_active: true,
      });

      const newUserIds = (updatedProject?.users ?? []).filter((id)=> !(oldUsers ?? []).includes(id));

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

      setTeamUserIds(updatedIds);
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
              <AssigneeIcon />
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
    </div >
  );
}
