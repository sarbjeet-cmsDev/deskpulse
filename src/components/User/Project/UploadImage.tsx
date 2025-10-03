import DropdownOptions from "@/components/DropdownOptions";
import ProjectService from "@/service/project.service";
import { useRef } from "react";

export const UploadImage = ({ project, projectId, fetchProject, handleFileError, handleFileSuccess, }: any) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleProjectAvatar = () => {
        fileInputRef.current?.click();
    };
    const sizeLimit = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxAllowedSize = sizeLimit * 1024 * 1024; 
         if (file && file.size > maxAllowedSize) {
              handleFileError();
              return;
        }

        handleFileSuccess();
        
        try {
            const res = await ProjectService.uploadProjectAvatar(
                projectId as string,
                file
            );
            if (res) {
                fetchProject();
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };
    return (
        <div className="">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <DropdownOptions
                options={[
                    {
                        key: "Update Project Avatar",
                        label: "Update Project Avatar",
                        color: "primary",
                        onClick: handleProjectAvatar,
                    },
                ]}
            />
        </div>
    );
};
