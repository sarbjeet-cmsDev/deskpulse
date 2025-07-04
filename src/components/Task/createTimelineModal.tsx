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

interface CreateTimelineModalProps {
  onCreate: (data: {
    date: string;
    time_spent: string;
    comment?: string;
  }) => Promise<void>;
}

export default function CreateTimelineModal({ onCreate }: CreateTimelineModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [date, setDate] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!date || !timeSpent) return;

    setLoading(true);
    try {
      await onCreate({ date, time_spent: timeSpent, comment });
      setDate('');
      setTimeSpent('');
      setComment('');
      onOpenChange();
    } catch (error) {
      console.error('Timeline creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} 
    //   className="bg-[#7980ff] text-white block w-full py-[16px] rounded-[12px] mt-[24px] px-[28px] font-bold" 
       className="bg-[#7980ff] text-white px-4 py-2 text-sm font-semibold"
       >
        
        + Log Time
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-0">
                <H5 className="text-center p-4 border-b border-[#31394f1a]">Log Time</H5>

                <div className="px-4 py-4 space-y-4">
                  <Input type="date" label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
                  <Input type="text" label="Duration (in hour)" value={timeSpent} onChange={(e) => setTimeSpent(e.target.value)} />
                  <Input type="text" label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>

                <div className="flex flex-col divide-y border-t">
                  <Button onPress={handleCreate} disabled={loading || !date || !timeSpent} className="p-4 bg-transparent text-blue-600 font-bold">
                    {loading ? 'Logging...' : 'Log Time'}
                  </Button>
                  <Button variant="light" onPress={onClose} className="p-4 bg-transparent text-[#31394f99] font-bold data-[hover=true]:bg-transparent">
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
