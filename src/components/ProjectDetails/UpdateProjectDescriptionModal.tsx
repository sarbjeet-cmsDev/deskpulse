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
import { projectDescriptionUpdateSchema } from '../validation/projectValidation';

interface UpdateProjectDescriptionModalProps {
  onUpdate: (description: string) => Promise<void>;
  projectId: string;
}

export default function UpdateProjectDescriptionModal({ onUpdate }: UpdateProjectDescriptionModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(
        projectDescriptionUpdateSchema.pick({ description: true})
      ),
      defaultValues: {
        description : '',
      },
    });

  const handleUpdate = async (values: { description: string; }) => {

    setLoading(true);
    try {
      await onUpdate(values.description); 
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
      <button
        onClick={onOpen}
        className="text-blue-600 text-sm font-semibold m-[10px]"
      >
        Edit
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-0">
                <H5 className="text-center p-4 border-b border-[#31394f1a]">
                  Update Description
                </H5>
                <form
                  onSubmit={handleSubmit(handleUpdate)}
                  className="px-4 py-4 space-y-4"
                  noValidate
                >
                <div className="px-4 py-4">
                  <Input
                    label="Description"
                     type="text"
                    placeholder=""
                     {...register("description")}
                  />
                  {errors.description && (
                      <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>
                    )}
                </div>

                <div className="flex flex-col divide-y border-t">
                  <Button
                  type="submit"
                    disabled={loading}
                    className="p-4 bg-transparent text-blue-600 font-bold"
                  >
                    {loading ? 'Updating...' : 'Update'}
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