"use client";

import ProjectCard from "@/components/IndexPage/ProjectCard";
import ProjectService from "@/service/project.service";
import UserService from "@/service/user.service";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function index() {
    const { userid, id } = useParams();
    const [project, setProject] = useState([]);
    const getUserProject = async () => {
        const getUserDetail: any = await UserService.getAssignedUser(userid as string)
        const role = getUserDetail?.roles?.[0]
        if (role === "admin") {
            const result: any = await ProjectService.getWorkSpaceByWorkSpaceId(id as string)
            setProject(result?.data)
        } else {

            const result: any = await ProjectService.getProjectByUser(userid as string, id as string);
            setProject(result?.data);
        }
    };

    useEffect(() => {
        getUserProject();
    }, []);

    console.log(project, "projectproject")
    return (
        <div className="pt-4 flex justify-center items-center gap-4 max-w-6xl mx-auto md:flex-row flex-col flex-wrap">
            {project?.map((item: any) => {
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
}
