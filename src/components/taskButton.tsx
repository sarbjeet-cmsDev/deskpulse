"use client";
import { PlusIcon } from "./icons";

interface TaskButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

const TaskButton: React.FC<TaskButtonProps> = ({
  onClick,
  ariaLabel = "Add new task",
}) => {

  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="fixed bottom-20 right-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="button"
    >
      <PlusIcon />
    </button>
  );
};

export default TaskButton;
