import { useState, useCallback } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import ReactSelect from "react-select";
import { debounce } from "lodash";
import Swal from "sweetalert2";
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
}

export default function MentionUserListModal({
  isOpen,
  onClose,
  taskId,
  onAssigned,
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
  
  const handleConfirmAssign = () => {
    if (!selectedUser) return;
    try {
      onAssigned(selectedUser.value);
      onClose();
    } catch (error) {
      console.log("failed to asign user",error)
    }
    
 
  };
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody className="p-6 space-y-4">
           <div className="mt-3 !h-[300px] p-10">
          <ReactSelect
            isMulti={false} 
            options={userOptions}
            value={selectedUser}
            placeholder="Search users..."
            inputValue={inputValue}
            onInputChange={(value) => {
              setInputValue(value);
              if (value.length >= 1) fetchUsers(value);
            }}
            onChange={(selected) => setSelectedUser(selected)}
            styles={{
              multiValueLabel: (styles) => ({ ...styles, color: "#000" }),
            }}
            />
          <button
            onClick={handleConfirmAssign}
            disabled={!selectedUser}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-20 mx-auto block"
            >
            Assign Task
          </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}


