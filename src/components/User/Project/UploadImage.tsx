import DropdownOptions from "@/components/DropdownOptions"
import ProjectService from "@/service/project.service";
import { useEffect, useRef, useState } from "react";
import ProjectAvtar from "@/assets/images/projectimage.png";

export const UploadImage = ({ project, projectId, fetchProject }: any) => {
    const [version, setVersion] = useState<number>(Date.now());

    const [projectImage, setProjectImage] = useState<string>(ProjectAvtar.src);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (project?.avatar) {
            setProjectImage(
                `${process.env.NEXT_PUBLIC_BACKEND_HOST}${project.avatar}?v=${version}`
            );
        }
    }, [project, version]);
    const handleProjectAvatar = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const res = await ProjectService.uploadProjectAvatar(
                projectId as string,
                file
            );

            if (res) {
                const avatarUrl = res?.avatar
                    ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${res?.avatar}?v=${version}`
                    : ProjectAvtar.src;
                setProjectImage(avatarUrl);
                setVersion(Date.now());
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
    )
}