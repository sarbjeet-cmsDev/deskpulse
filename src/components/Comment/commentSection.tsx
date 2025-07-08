'use client';

import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import { Button } from '@/components/Form/Button';
import AdminUserService, { IUser } from '@/service/adminUser.service';
import CommentService from '@/service/comment.service';
import { Input } from '@/components/Form/Input';
import { MultiValue, Props as SelectProps } from 'react-select';

type UserOption = { label: string; value: string };

const ReactSelect = dynamic<SelectProps<UserOption, true>>(
  () => import('react-select'),
  { ssr: false }
);

interface CommentInputProps {
  taskId: string;
  createdBy: string;
  onCommentCreated: () => void;
  onCancel?: () => void;      
  inline:boolean;
}

export default function CommentInputSection({ taskId, createdBy, onCommentCreated, onCancel, inline = false }: CommentInputProps) {
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
        created_by: createdBy,
        mentioned: mentionedUsers.map((u) => u.value),
      };

      await CommentService.createComment(payload);
      setContent('');
      setMentionedUsers([]);
      setInputValue('');
      onCommentCreated();
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 ${inline ? 'border border-gray-300 rounded shadow-sm bg-white mt-6' : ''}`}>
      <Input
        type="text"
        label="Comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here..."
      />

      <div className="mt-3">
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
          onChange={(selected: MultiValue<UserOption>) => setMentionedUsers(selected as UserOption[])}
          styles={{
            multiValueLabel: (styles) => ({ ...styles, color: '#000' }),
          }}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button variant="light" onPress={onCancel} className="px-4">
            Cancel
          </Button>
        )}
        <Button
          onPress={handleCreate}
          disabled={loading || !content.trim()}
          className="bg-[#7980ff] text-white hover:bg-[#5e64e6] px-4"
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}


