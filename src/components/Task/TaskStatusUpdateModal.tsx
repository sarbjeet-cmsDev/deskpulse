import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import TaskService from "@/service/task.service";
import { FaCheck } from "react-icons/fa";
import { isDarkColor } from "@/utils/IsDarkColor";

interface TaskPropertyUpdateModalProps {
  title: string;
  options: string[];
  currentValue: string;
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  fieldName: "status" | "priority" | "client_acceptance";
  onUpdate: () => void;
  currentColor?: string
  setPriorityActiveColor?: any
  isPriority?: boolean
  isCientAcceptance?: boolean
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
  isPriority,
  isCientAcceptance
}: TaskPropertyUpdateModalProps) {
  const [selectedValue, setSelectedValue] = useState<string>(currentValue);
  const [selectedColor, setSelectedColor] = useState<any>()
  useEffect(() => {
    if (isOpen) {
      setSelectedValue(currentValue);
    }
  }, [isOpen, currentValue]);

  const handleConfirm = async () => {

    try {
      await TaskService.updateTaskStatus(taskId, { [fieldName]: selectedValue });
      onUpdate?.();
      if (isPriority) {

        localStorage.setItem("priortiyactiveColor", selectedColor)
      } else if (isCientAcceptance) {
        localStorage.setItem("isCientAcceptanceColor", selectedColor)

      }

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
            {options.map((option: any) => {
              const value = option?.title || option;
              const color = option?.color
              const isSelected = selectedValue === value;


              const style = option?.color
                ? {
                  backgroundColor: option.color,
                  color: isDarkColor(option.color) ? 'white' : 'black'
                }
                : {};

              return (
                <button
                  key={value}
                  onClick={() => {
                    setSelectedValue(value);
                    setSelectedColor(color);
                  }}

                  className={`flex justify-between px-3 py-2 rounded text-sm border text-left ${isSelected
                    ? "bg-theme-primary text-white border-bg-theme-primary"
                    : "text-gray-800 border-gray-300 hover:border-gray-400"
                    }`}
                  style={option?.color ? style : {}}
                >
                  {(option?.title || option)
                    .replace(/_/g, " ")
                    .toUpperCase()}

                  {option?.title && isSelected ? <FaCheck />
                    : ""}
                </button>
              );
            })}
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

