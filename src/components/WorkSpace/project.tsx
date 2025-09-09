"use client";

import ProjectService from "@/service/project.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectCard from "../IndexPage/ProjectCard";
import Link from "next/link";

export const WorkSpaceProject = () => {
    const { id } = useParams();
    const [getWorkSpaceProject, setGetWorkSpaceProject] = useState<any>([]);
    const fetchWorkSpaceProject = async () => {
        const result: any = await ProjectService.getWorkSpaceByWorkSpaceId(
            id as string
        );
        setGetWorkSpaceProject(result?.data);
        console.log(result?.data, "result++++");
    };

    useEffect(() => {
        fetchWorkSpaceProject();
    }, []);

    return (
        <div className="pt-4 flex justify-center items-center gap-4 max-w-6xl mx-auto md:flex-row flex-col flex-wrap">
            {getWorkSpaceProject?.map((item: any) => {
                return (
                    <Link
                        className="md:max-w-[calc(50%-1em)]"
                        key={item._id}
                        href={`/project/${item.code}`}
                    >
                        <ProjectCard project={item} kanban={[]} taskCounts={{}} />
                    </Link>
                );
            })}
        </div>
    );
};
