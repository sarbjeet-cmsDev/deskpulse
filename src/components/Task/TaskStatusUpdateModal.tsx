import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { TaskStatusEnum } from "@/types/task.interface"; 
import TaskService from "@/service/task.service";

interface TaskStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: TaskStatusEnum;
  taskId: string;
  onStatusUpdate: () => void;
}

export default function TaskStatusUpdateModal({
  isOpen,
  onClose,
  currentStatus,
  taskId,
  onStatusUpdate,
}: TaskStatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatusEnum>(currentStatus);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  const handleConfirm = async () => {
    try {
      await TaskService.updateTask(taskId, { status: selectedStatus });
      onStatusUpdate?.();
      onClose();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const statusOptions = Object.values(TaskStatusEnum);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody className="p-6">
          <h2 className="text-lg font-semibold mb-4">Update Task Status</h2>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-2 rounded text-sm border ${
                  selectedStatus === status
                    ? "bg-theme-primary text-white border-bg-theme-primary"
                    : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
                }`}
              >
                {status.replace(/_/g, " ").toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={handleConfirm}
            disabled={selectedStatus === currentStatus}
            className="mt-5 btn-primary px-4 py-2 rounded disabled:opacity-50"
          >
            Confirm Status Update
          </button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
