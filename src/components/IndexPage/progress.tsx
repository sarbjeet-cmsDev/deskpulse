import { Progress } from "@heroui/react";

export default function ProgressBar() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Progress
        aria-label="Loading..."
        size="sm"
        value={50}
        classNames={{
          track: "bg-[#f6f5f7]",  
          indicator: "bg-[#64bef1]", 
        }}
      />
    </div>
  );
}
