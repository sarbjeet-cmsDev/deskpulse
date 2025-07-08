import { useState, useCallback } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { H5 } from "@/components/Heading/H5";
import { Input } from "@/components/Form/Input";
import ReactSelect, { MultiValue } from "react-select";
import { debounce } from "lodash";
import CommentService  from "@/service/comment.service";
import AdminUserService from "@/service/adminUser.service";

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
  userOptions = [],
  enableUserSearch = true,
}: MentionCommentModalProps) {
  const [content, setContent] = useState("");
  const [mentionedUsers, setMentionedUsers] = useState<IUserOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [userSearchOptions, setUserSearchOptions] = useState<IUserOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(
    debounce(async (input: string) => {
      try {
        const users = await AdminUserService.searchUsers(input);
        const options = users.map((user: any) => ({
          label: `${user.firstName} ${user.lastName} (${user.email})`,
          value: user._id,
        }));
        setUserSearchOptions(options);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUserSearchOptions([]);
      }
    }, 300),
    []
  );

  const handleCreate = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const payload = {
        content,
        task: taskId,
        created_by: userId,
        mentioned: mentionedUsers.map((u) => u.value),
      };

      await CommentService.createComment(payload);
      setContent("");
      setMentionedUsers([]);
      setInputValue("");
      onClose();
      onCommentCreated();
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const combinedOptions = enableUserSearch ? userSearchOptions : userOptions;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody className="p-0">
          <H5 className="text-center p-4 border-b border-[#31394f1a]">Add Comment</H5>
          <div className="px-4 py-4 space-y-4">
            <Input
              type="text"
              label="Comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment here..."
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mention Users</label>
              <ReactSelect
                isMulti
                options={combinedOptions}
                value={mentionedUsers}
                placeholder="Type to search users..."
                inputValue={inputValue}
                onInputChange={(value: string) => {
                  setInputValue(value);
                  if (enableUserSearch && value.length >= 1) fetchUsers(value);
                }}
                onChange={(selected: MultiValue<IUserOption>) => {
                  setMentionedUsers(selected as IUserOption[]);
                }}
                styles={{
                  multiValueLabel: (styles) => ({ ...styles, color: "#000" }),
                }}
              />
            </div>
          </div>
          <div className="flex justify-end px-4 pb-4">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
