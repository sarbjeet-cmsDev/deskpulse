import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { ReactNode } from "react";

export type AllowedColors = 'danger' | 'primary' | 'default' | 'secondary' | 'success' | 'warning';

export interface DropdownOption {
  key: string;
  label: string;
  onClick: () => void;
  color?: AllowedColors;  
  icon?: ReactNode;  
}

interface DropdownOptionsProps {
  options: DropdownOption[];
  icon?: ReactNode; 
}

export default function DropdownOptions({ options, icon }: DropdownOptionsProps) {
  return (
    <Dropdown backdrop="opaque">
      <DropdownTrigger>
        <Button className="bg-transparent p-0 shadow-none border-none hover:bg-transparent focus:outline-none max-[768px]:inline-block max-[768px]:ml-2">
          {icon ? icon : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="3" r="2" />
              <circle cx="10" cy="10" r="2" />
              <circle cx="10" cy="17" r="2" />
            </svg>
          )}
        </Button>
      </DropdownTrigger>

      <DropdownMenu aria-label="Dropdown Actions" variant="flat">
        {options.map((opt) => (
          <DropdownItem
            key={opt.key}
            onPress={opt.onClick}
            color={opt.color || 'default'}
            className="rounded-none bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent border-none hover:border-b hover:border-b-[#e3e3e3] flex items-center gap-2"
          >
            {opt.icon && opt.icon}
            {opt.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
