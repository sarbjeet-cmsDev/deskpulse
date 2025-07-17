import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import TaskService from "@/service/task.service";

interface TaskStatusUpdateModalProps {
  kanbanList: string[];
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  taskId: string;
  onStatusUpdate: () => void;
}

export default function TaskStatusUpdateModal({
  isOpen,
  onClose,
  currentStatus,
  taskId,
  onStatusUpdate,
  kanbanList,
}: TaskStatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);

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

  const statusOptions = Object.values(kanbanList);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody className="p-6">
          <h2 className="text-lg font-semibold mb-4">Update Task Status</h2>

          <div
            className="flex flex-col gap-2 overflow-y-auto"
            style={{ maxHeight: "200px" }}
          >
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-2 rounded text-sm border text-left ${
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
