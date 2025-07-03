'use client';

import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@heroui/react';
import { Button } from '@/components/Form/Button';
import { Input } from '@/components/Form/Input';
import { H5 } from '@/components/Heading/H5';
import { useState } from 'react';

// ✅ Define prop type
interface CreateTaskModalProps {
  onCreate: (title: string) => Promise<void>;
}

export default function CreateTaskModal({ onCreate }: CreateTaskModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onCreate(title); // ✅ use prop function
      setTitle('');
      onOpenChange(); // Close modal
    } catch (error) {
      console.error('Task creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-[#7980ff] text-white block w-full flex justify-center items-center gap-2 text-[14px] leading-[16px] font-bold py-[16px] rounded-[12px] mt-[24px] px-[28px]"
      >
        Create Task
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-0">
                <H5 className="text-center p-4 border-b border-[#31394f1a]">
                  Create New Task
                </H5>

                <div className="px-4 py-4">
                  <Input
                    label="Title"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col divide-y border-t">
                  <Button
                    onPress={handleCreate}
                    disabled={loading || !title.trim()}
                    className="p-4 bg-transparent text-blue-600 font-bold"
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </Button>
                  <Button
                    variant="light"
                    onPress={onClose}
                    className="p-4 bg-transparent text-[#31394f99] font-bold data-[hover=true]:bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
