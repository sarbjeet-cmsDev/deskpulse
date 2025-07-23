"use client";

import { Modal, ModalContent, ModalBody } from "@heroui/react";
import { H5 } from "@/components/Heading/H5";
import CommentInputSection from "@/components/Comment/commentSection";

interface CreateCommentModalProps {
  taskId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentCreated: () => void;
}

export default function ({
  taskId,
  userId,
  isOpen,
  onClose,
  onCommentCreated,
}: CreateCommentModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody className="p-0">
          <H5 className="text-center p-4 border-b border-[#31394f1a]">
            Add Comment
          </H5>
          <CommentInputSection
            taskId={taskId}
            createdBy={userId}
            onCommentCreated={onCommentCreated}
            onCancel={onClose}
            inline={true}
            isButton={true}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
