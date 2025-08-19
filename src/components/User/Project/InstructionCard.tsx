import ImageLightbox from "@/components/common/ImagePopUp/ImageLightbox";
import { H5 } from "@/components/Heading/H5";
import { useEffect, useRef, useState } from "react";

export const InstructionCard = ({ project }: any) => {
    const descriptionRef = useRef<HTMLDivElement | null>(null);
    const deployRef = useRef<HTMLDivElement | null>(null);
    const notesRef = useRef<HTMLDivElement | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLImageElement;
            if (target?.tagName === "IMG") {
                setCurrentImage(target.src);
                setLightboxOpen(true);
            }
        };

        const containers = [
            descriptionRef.current,
            deployRef.current,
            notesRef.current,
        ];
        containers.forEach((el) => el?.addEventListener("click", handler));

        return () => {
            containers.forEach((el) => el?.removeEventListener("click", handler));
        };
    }, [project]);
    return (
        <div className="flex flex-col gap-2 py-5">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <H5 className=" font-semibold mb-2">Project Description</H5>
                <div
                    ref={descriptionRef}
                    className="prose max-w-none [&_img]:w-28 [&_img]:rounded-xl projectDescription"
                    dangerouslySetInnerHTML={{
                        __html:
                            project?.description ||
                            "<p>No description provided.</p>",
                    }}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 deployInstruction">
                <H5 className="font-semibold mb-2">Deploy Instruction</H5>
                <div
                    ref={deployRef}
                    className="prose max-w-none [&_img]:w-28 [&_img]:rounded-xl"
                    dangerouslySetInnerHTML={{
                        __html:
                            project?.deploy_instruction ||
                            "<p>No Instruction provided.</p>",
                    }}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 criticalNotes">
                <H5 className="font-semibold mb-2">Critical Notes</H5>
                <div
                    ref={notesRef}
                    className="prose max-w-none [&_img]:w-28 [&_img]:rounded-xl"
                    dangerouslySetInnerHTML={{
                        __html:
                            project?.critical_notes ||
                            "<p>No Critical Notes provided.</p>",
                    }}
                />
            </div>
            {lightboxOpen && (
                <ImageLightbox
                    open={lightboxOpen}
                    imageUrl={currentImage ?? ""}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </div>
    )
}