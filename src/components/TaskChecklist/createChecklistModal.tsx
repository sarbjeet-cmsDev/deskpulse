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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskCreateSchema } from '../validation/taskValidation';
import { createChecklistSchema } from '../validation/taskChecklistValidation';

interface CreateTaskChecklistModalProps {
  onCreate: (title: string) => Promise<void>;
}

export default function CreateChecklistModal({ onCreate }: CreateTaskChecklistModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(
        createChecklistSchema.pick({ title: true})
      ),
      defaultValues: {
        title : '',
      },
    });

  const handleCreate = async (values: { title: string; }) => {

    setLoading(true);
    try {
      await onCreate(values.title); 
       reset();
      onOpenChange(); 
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
      className="btn-primary text-white px-4 py-2 text-sm font-semibold"
      >
        Create Taskchecklist
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-0">
                <H5 className="text-center p-4 border-b border-[#31394f1a]">
                  Create Task Checklist
                </H5>
                <form
                  onSubmit={handleSubmit(handleCreate)}
                  className="px-4 py-4 space-y-4"
                  noValidate
                >
                <div className="px-4 py-4">
                  <Input
                    label="Title"
                     type="text"
                    placeholder="Enter title"
                     {...register("title")}
                  />
                  {errors.title && (
                      <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>
                    )}
                </div>

                <div className="flex flex-col divide-y border-t">
                  <Button
                  type="submit"
                    disabled={loading}
                    className="p-4 bg-transparent text-theme-primary font-bold"
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </Button>
                  <Button
                   type="button"
                    variant="light"
                    onPress={onClose}
                    className="p-4 bg-transparent text-[#31394f99] font-bold data-[hover=true]:bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
