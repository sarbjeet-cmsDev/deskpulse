import { useCallback, useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import ReactSelect, { MultiValue } from "react-select";
import { debounce } from "lodash";
import AdminUserService, { IUser } from "@/service/adminUser.service";

export interface IUserOption {
  label: string;
  value: string;
}

interface MultiSelectUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserIds: string[];
  onConfirm: (userIds: string[]) => void;
  activeUsers:any;
}

export default function MultiSelectUserModal({
  isOpen,
  onClose,
  selectedUserIds,
  onConfirm,
  activeUsers,
}: MultiSelectUserModalProps) {
  const [userOptions, setUserOptions] = useState<IUserOption[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUserOption[]>([]);
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

       
        if (input) {
          const selected = options.filter((opt) =>
            selectedUserIds.includes(opt.value)
          );
          setSelectedUsers(selected);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUserOptions([]);
      }
    }, 300),
    [selectedUserIds]
  );

  useEffect(() => {
    if (isOpen) {
      fetchUsers("");
      setInputValue(""); 
      const selected = activeUsers.map((user: IUser) => ({
      label: `${user.firstName || user.username} ${user.lastName || ""} (${user.email})`,
      value: user._id,
    }));

    setSelectedUsers(selected);
    }
  }, [isOpen,activeUsers, fetchUsers]);

  const handleConfirm = () => {
    const ids = selectedUsers.map((u) => u.value);
    onConfirm(ids);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody className="p-6 space-y-4">
          <div className="mt-3 h-[300px] p-10 overflow-hidden">
            <ReactSelect
              isMulti
              options={userOptions}
              value={selectedUsers}
              placeholder="Search users..."
              inputValue={inputValue}
              onInputChange={(value) => {
                setInputValue(value);
                fetchUsers(value);
              }}
              onChange={(selected: MultiValue<IUserOption>) => {
                setSelectedUsers(selected as IUserOption[]);
              }}
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
              onClick={handleConfirm}
              disabled={selectedUsers.length === 0}
              className="btn-primary text-white px-4 py-2 rounded mt-5 mx-auto block"
            >
              Assign
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
