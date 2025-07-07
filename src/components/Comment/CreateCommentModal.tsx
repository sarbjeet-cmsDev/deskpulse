'use client';

import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import { Modal, ModalContent, ModalBody, useDisclosure } from '@heroui/react';
import { Button } from '@/components/Form/Button';
import { Input } from '@/components/Form/Input';
import { H5 } from '@/components/Heading/H5';
import CommentService from '@/service/comment.service';
import AdminUserService, { IUser } from '@/service/adminUser.service';
import { MultiValue, Props as SelectProps } from 'react-select';

// ✅ Define option type
type UserOption = { label: string; value: string };

// ✅ Dynamic import with proper typing
const ReactSelect = dynamic<SelectProps<UserOption, true>>(
  () => import('react-select'),
  { ssr: false }
);

interface CreateCommentModalProps {
  taskId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentCreated: () => void;
}

export default function CreateCommentModal({ taskId, userId,  isOpen, onClose, onCommentCreated }: CreateCommentModalProps) {
  const [content, setContent] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<UserOption[]>([]);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [inputValue, setInputValue] = useState('');
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
        console.error('Error fetching users:', err);
        setUserOptions([]);
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
      setContent('');
      setMentionedUsers([]);
      setInputValue('');
      onClose(); 
      onCommentCreated();
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <ModalBody className="p-0">
            <H5 className="text-center p-4 border-b border-[#31394f1a]">Add Comment</H5>

            <div className="px-4 py-4 space-y-4">
              {/* Comment Text Input */}
              <Input
                type="text"
                label="Comment"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your comment here..."
              />

              {/* Mention Users Multi-Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mention Users</label>
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
                  onChange={(selected: MultiValue<UserOption>) => {
                    setMentionedUsers(selected as UserOption[]);
                  }}
                  styles={{
                    multiValueLabel: (styles) => ({ ...styles, color: '#000' }),
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col divide-y border-t">
              <Button
                onPress={handleCreate}
                disabled={loading || !content.trim()}
                className="p-4 bg-transparent text-blue-600 font-bold"
              >
                {loading ? 'Adding...' : 'Add Comment'}
              </Button>
              <Button
                variant="light"
                onPress={onClose}
                className="p-4 bg-transparent text-[#31394f99] font-bold"
              >
                Cancel
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
