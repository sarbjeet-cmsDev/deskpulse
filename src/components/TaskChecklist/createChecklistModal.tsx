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
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChecklistSchema } from '../validation/taskChecklistValidation';
import { TextArea } from "../Form/TextArea";

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
      createChecklistSchema.pick({ title: true })
    ),
    defaultValues: {
      title: '',
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
    <>
      <Button
        onPress={onOpen}
        className="btn-primary text-white px-4 py-2 text-sm font-semibold"
      >
        Create Taskchecklist
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} shouldBlockScroll={false} classNames={{ wrapper: "items-start h-auto", base: "my-auto" }}>
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
      
                   <div>
                                      <TextArea
                                        className="w-full rounded-lg border border-gray-100 bg-gray-100 p-3 focus:outline-none"
                                        placeholder="Title"
                                        {...register("title")}
                                        rows={2}
                                      />
                                      {errors.title && (
                                        <p className="text-red-500 text-xs mt-1">
                                          {errors.title.message as string}
                                        </p>
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
