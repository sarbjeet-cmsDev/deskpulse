import { useState, useCallback, useEffect } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import ReactSelect from "react-select";
import { debounce } from "lodash";
import AdminUserService, { IUser } from "@/service/adminUser.service";

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
}

export default function MentionUserListModal({
  isOpen,
  onClose,
  taskId,
  onAssigned,
  users
}: MentionUserListModalProps) {
  const [selectedUser, setSelectedUser] = useState<IUserOption | null>(null);
  const [userOptions, setUserOptions] = useState<IUserOption[]>([]);
  const [inputValue, setInputValue] = useState("");


  const fetchUsers = useCallback(
    debounce(async (input: string) => {
      try {
        const users = await AdminUserService.searchUsers(input);
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
    []
  );

  useEffect(() => {
    if (isOpen) {
      fetchUsers("");
      const selected = users.map((user: IUser) => ({
      label: `${user.firstName || user.username} ${user.lastName || ""}`,
      value: user._id,
    }));
     setSelectedUser(selected);
    }
  }, [isOpen,users]);

  const handleConfirmAssign = () => {
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
        <ModalBody className="p-6 space-y-4">
          <div className="mt-3 h-[300px] p-10 overflow-hidden">
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
