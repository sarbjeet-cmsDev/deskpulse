import { useState, useCallback } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";

import ReactSelect, { MultiValue } from "react-select";
import { debounce } from "lodash";
import AdminUserService, { IUser } from "@/service/adminUser.service";

export interface IUserOption {
  label: string;
  value: string;
}

interface MentionCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommentCreated: () => void;
  taskId: string;
  userId: string;
  userOptions?: IUserOption[];
  enableUserSearch?: boolean;
}

export default function MentionUserListModal({
  isOpen,
  onClose,
  onCommentCreated,
  taskId,
  userId,
  enableUserSearch = true,
}: MentionCommentModalProps) {
  const [content, setContent] = useState("");
  const [mentionedUsers, setMentionedUsers] = useState<UserOption[]>([]);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

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

  type UserOption = { label: string; value: string };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody className="p-0 !h-[300px]">
          <div className="mt-3 !h-[300px] p-10">
            <ReactSelect
              isMulti
              options={userOptions}
              value={mentionedUsers}
              placeholder="Type to search users..."
              inputValue={inputValue}
              onInputChange={(value: string) => {
                setInputValue(value);
                if (value.length >= 1) fetchUsers(value);
              }}
              onChange={(selected: MultiValue<UserOption>) =>
                setMentionedUsers(selected as UserOption[])
              }
              styles={{
                multiValueLabel: (styles) => ({ ...styles, color: "#000" }),
              }}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
