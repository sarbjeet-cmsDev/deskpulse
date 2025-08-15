import { useState, useCallback, useEffect,useRef } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import ReactSelect from "react-select";
import { debounce } from "lodash";
import AdminUserService, { IUser } from "@/service/adminUser.service";
import ProjectService from "@/service/project.service";
import { getSocket } from "@/utils/socket"; // Adjust path as needed
import {  useSelector } from "react-redux";
import {  RootState } from "@/store/store";
export interface IUserOption {
  label: string;
  value: string;
}

interface MentionUserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  onAssigned: (userId: string) => void;
  users:any;
  task:any;
}

export default function MentionUserListModal({
  isOpen,
  onClose,
  taskId,
  onAssigned,
  users,
  task,
}: MentionUserListModalProps) {
  const [selectedUser, setSelectedUser] = useState<IUserOption | null>(null);
  const [userOptions, setUserOptions] = useState<IUserOption[]>([]);
  const [inputValue, setInputValue] = useState("");
    const user: any = useSelector((state: RootState) => state.user.data);

useEffect(()=>{
  task
},[taskId])
 

  const fetchUsers = useCallback(
    debounce(async (input: string) => {
      if (!task?.project) return;
      try {
       
        const usersData = await ProjectService.getProjectUsers(task.project, input);
        const users = usersData.users || []
     
        const options = users.map((user: IUser) => ({
          label: `${user.firstName} ${user.lastName} (${user.email})`,
          value: user._id,
        }));
        setUserOptions(options);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUserOptions([]);
      }
    }, 300),
    [task]
  );

  useEffect(() => {
    if (isOpen && task?.project) {
      fetchUsers("");
      const selected = users.map((user: IUser) => ({
      label: `${user.firstName || user.username} ${user.lastName || ""}`,
      value: user._id,
    }));
     setSelectedUser(selected);
    }
  }, [isOpen,users]);

  const socketRef = useRef(getSocket());
  const handleConfirmAssign = () => {
 

 if (!socketRef.current.connected) {
        socketRef.current.connect();
      }
      socketRef.current.on("connect", () => {
        socketRef.current.emit("register-user", user.id); // Send your user ID immediately
      });

      socketRef.current.emit("task-updated", {
        taskId: taskId, // You need to replace this with the actual task ID
        sender: user.firstName + " " + user.lastName,
        receiverId: `${selectedUser?.value}`,
        description: "Assigned You a Task",
      });

      console.log("✅ socket event 'task-updated' hit while assigned user in task");

    if (!selectedUser) return;
    try {
      onAssigned(selectedUser.value);
      onClose();
    } catch (error) {
      console.log("Failed to assign user", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody className="p-4 space-y-8">
          <div className="mt-3 h-[300px] p-8 overflow-hidden">
            <ReactSelect
              isMulti={false}
              options={userOptions}
              value={selectedUser}
              placeholder="Search users..."
              inputValue={inputValue}
              onInputChange={(value) => {
                setInputValue(value);
                fetchUsers(value);
              }}
              onChange={(selected) => setSelectedUser(selected)}
              menuPlacement="bottom"
              menuShouldScrollIntoView={false}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "40px",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                  maxHeight: 200,
                  overflowY: "auto",
                  position: "absolute",
                }),
                menuList: (base) => ({
                  ...base,
                  paddingTop: 0,
                  paddingBottom: 0,
                }),
              }}
            />

            <button
              onClick={handleConfirmAssign}
              disabled={!selectedUser}
              className="btn-primary text-white px-4 py-2 rounded mt-20 mx-auto block"
            >
              Assign Task
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
