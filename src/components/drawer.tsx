'use client';

import React, { useRef } from "react";
import { ProfileIcon } from "./icons";

interface DrawerFunctionProps {
  onImageSelect: (file: File) => void;
}

export default function DrawerFunction({ onImageSelect }: DrawerFunctionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  return (
    <>
      <div onClick={handleIconClick} className="cursor-pointer p-[5px] bg-[#7980ff] rounded-full">
        <ProfileIcon />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}

