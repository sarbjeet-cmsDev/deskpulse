// 'use client';

// import {
//   Modal,
//   ModalContent,
//   ModalBody,
//   useDisclosure,
// } from '@heroui/react';
// import { Button } from '@/components/Form/Button';
// import { Input } from '@/components/Form/Input';
// import { H5 } from '@/components/Heading/H5';
// import { useState } from 'react';

// interface CreateTimelineModalProps {
//   onCreate: (data: {
//     date: string;
//     time_spent: string;
//     comment?: string;
//   }) => Promise<void>;
// }

// export default function CreateTimelineModal({ onCreate }: CreateTimelineModalProps) {
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const [date, setDate] = useState('');
//   const [timeSpent, setTimeSpent] = useState('');
//   const [comment, setComment] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleCreate = async () => {
//     if (!date || !timeSpent || !comment) return;

//     setLoading(true);
//     try {
//       await onCreate({ date, time_spent: timeSpent, comment });
//       setDate('');
//       setTimeSpent('');
//       setComment('');
//       onOpenChange();
//     } catch (error) {
//       console.error('Timeline creation failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Button onPress={onOpen} 
//        className="bg-[#7980ff] text-white px-4 py-2 text-sm font-semibold"
//        >
//         + Log Time
//       </Button>

//       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalBody className="p-0">
//                 <H5 className="text-center p-4 border-b border-[#31394f1a]">Log Time</H5>

//                 <div className="px-4 py-4 space-y-4">
//                   <Input type="date" label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
//                   <Input type="text" label="Duration (in hour)" value={timeSpent} onChange={(e) => setTimeSpent(e.target.value)} />
//                   <Input type="text" label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
//                 </div>

//                 <div className="flex flex-col divide-y border-t">
//                   <Button onPress={handleCreate} disabled={loading || !date || !timeSpent} className="p-4 bg-transparent text-blue-600 font-bold">
//                     {loading ? 'Logging...' : 'Log Time'}
//                   </Button>
//                   <Button variant="light" onPress={onClose} className="p-4 bg-transparent text-[#31394f99] font-bold data-[hover=true]:bg-transparent">
//                     Cancel
//                   </Button>
//                 </div>
//               </ModalBody>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }



"use client";

import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { Button } from "@/components/Form/Button";
import { Input } from "@/components/Form/Input";
import { H5 } from "@/components/Heading/H5";
import { useState } from "react";
import { z } from "zod";
import { createTimelineSchema } from "@/components/validation/timelineValidaion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CreateTimelineModalProps {
  onCreate: (data: {
    date: string;
    time_spent: string;
    comment: string;
  }) => Promise<void>;
}

export default function CreateTimelineModal({ onCreate }: CreateTimelineModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      createTimelineSchema.pick({ date: true, time_spent: true, comment: true })
    ),
    defaultValues: {
      date: "",
      time_spent: "",
      comment: "",
    },
  });

  const handleCreate = async (values: { date: string; time_spent: string; comment: string }) => {
    setLoading(true);
    try {
      await onCreate(values);
      reset();
      onOpenChange();
    } catch (error) {
      console.error("Timeline creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-[#7980ff] text-white px-4 py-2 text-sm font-semibold"
      >
        + Log Time
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-0">
                <H5 className="text-center p-4 border-b border-[#31394f1a]">
                  Log Time
                </H5>

                <form
                  onSubmit={handleSubmit(handleCreate)}
                  className="px-4 py-4 space-y-4"
                  noValidate
                >
                  <div>
                    <Input
                      type="date"
                      label="Date"
                      {...register("date")}
                      required={false} 
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date.message as string}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="Duration (in hour)"
                      {...register("time_spent")}
                    />
                    {errors.time_spent && (
                      <p className="text-red-500 text-xs mt-1">{errors.time_spent.message as string}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="Comment"
                      {...register("comment")}
                    />
                    {errors.comment && (
                      <p className="text-red-500 text-xs mt-1">{errors.comment.message as string}</p>
                    )}
                  </div>

                  <div className="flex flex-col divide-y border-t">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="p-4 bg-transparent text-blue-600 font-bold"
                    >
                      {loading ? "Logging..." : "Log Time"}
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
