"use client";

import { useEffect, useState } from "react";

interface TaskButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

const TaskButton: React.FC<TaskButtonProps> = ({
  onClick,
  ariaLabel = "Add new task",
}) => {
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="));
      return match ? decodeURIComponent(match.split("=")[1]) : null;
    };

    const role = getCookie("role");
    setIsUser(role === "user");
  }, []);

  if (!isUser) return null; 

  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
};

export default TaskButton;
