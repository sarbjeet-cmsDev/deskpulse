import { useCallback, useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import ReactSelect, { MultiValue } from "react-select";
import { debounce } from "lodash";
import AdminUserService, { IUser } from "@/service/adminUser.service";
import { Button } from "./Button";
import { H5 } from "../Heading/H5";

export interface IUserOption {
  label: string;
  value: string;
}

interface MultiSelectUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserIds: string[];
  onConfirm: (userIds: string[]) => void;
  activeUsers: any;
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
  }, [isOpen, activeUsers, fetchUsers]);

  const handleConfirm = () => {

    const ids = selectedUsers.map((u) => u.value);

    onConfirm(ids);
    onClose();
  };

   useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} shouldBlockScroll={false} classNames={{ wrapper: "items-start h-auto", base: "my-auto rounded-2xl shadow-xl" }}>
      <ModalContent>
        <ModalBody className="p-3 space-y-3">
           <H5 className="text-center py-3 border-b border-[#31394f1a]">Add Team Member</H5>
          <div className="flex flex-col justify-between h-[440px] p-5 overflow-hidden">
            <ReactSelect
              isMulti
              closeMenuOnSelect={false}
              options={userOptions}
              value={selectedUsers}
              placeholder="Search users..."
              inputValue={inputValue}
              onInputChange={(value) => {
                setInputValue(value);
              }}
              onChange={(selected: MultiValue<IUserOption>) => {
                setSelectedUsers(selected as IUserOption[]);
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "40px",
                }),
                valueContainer: (base) => ({
                  ...base,
                  maxHeight: "200px",
                  overflowY: "auto",
                }),
                menu: (base) => ({
                  ...base,
                  maxHeight: "200px",
                  overflowY: "auto",
                  position: "absolute",
                }),
                menuList: (base) => ({
                  ...base,
                  paddingTop: 0,
                  paddingBottom: 0,
                  maxHeight: 200,
                  overflowY: "scroll",
                }),
              }}
            />

            <Button
              onPress={handleConfirm}
              disabled={selectedUsers.length === 0}
              className={`w-full btn-primary text-white px-4 py-2 rounded-xl mt-2 transition mx-auto block ${selectedUsers.length === 0 ? "cursor-not-allowed" : ""}`}
            >
              Add Member
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
