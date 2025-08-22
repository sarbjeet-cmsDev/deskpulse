import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import TaskService from "@/service/task.service";

interface TaskPropertyUpdateModalProps {
  title: string; 
  options: string[]; 
  currentValue: string; 
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  fieldName: "status" | "priority" | "client_acceptance"; 
  onUpdate: () => void;
}

export default function TaskPropertyUpdateModal({
  title,
  options,
  currentValue,
  isOpen,
  onClose,
  taskId,
  fieldName,
  onUpdate,
}: TaskPropertyUpdateModalProps) {
  const [selectedValue, setSelectedValue] = useState<string>(currentValue);

  useEffect(() => {
    if (isOpen) {
      setSelectedValue(currentValue);
    }
  }, [isOpen, currentValue]);

  const handleConfirm = async () => {
    console.log(currentValue,"cutrent value")
    console.log(onUpdate,"on updte")
    try {
      await TaskService.updateTaskStatus(taskId, { [fieldName]: selectedValue });
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error(`Failed to update task ${fieldName}:`, error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody className="p-6">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>

          <div
            className="flex flex-col gap-2 overflow-y-auto"
            style={{ maxHeight: "200px" }}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedValue(option)}
                className={`px-3 py-2 rounded text-sm border text-left ${
                  selectedValue === option
                    ? "bg-theme-primary text-white border-bg-theme-primary"
                    : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
                }`}
              >
                {option.replace(/_/g, " ").toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            disabled={selectedValue === currentValue}
            className="mt-5 btn-primary px-4 py-2 rounded disabled:opacity-50"
          >
            Confirm Update
          </button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

