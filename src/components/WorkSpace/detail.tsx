"use client";
import { WorkSpaceService } from "@/service/workSpace.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../Form/Button";

interface Member {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl?: string;
}

interface WorkSpaceDetailType {
    name: string;
    description?: string;
    title?: string;
    members: Member[];
    _id?: String;
}

export const WorkSpaceDetail = () => {
    const { id } = useParams();
    const [workSpaceDetail, setWorkSpaceDetail] =
        useState<WorkSpaceDetailType | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWorkSpaceDetail = async () => {
        try {
            const result: any = await WorkSpaceService.getWorkSpaceByID(id as string);
            const data: WorkSpaceDetailType = result?.data;

            if (data?.members) {
                data.members.sort((a, b) => a.lastName.localeCompare(b.lastName));
            }

            setWorkSpaceDetail(data);
        } catch (err) {
            console.error("Failed to fetch workspace detail", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkSpaceDetail();
    }, []);

    const router = useRouter();
    if (loading)
        return <p className="text-center mt-10">Loading workspace details...</p>;
    if (!workSpaceDetail)
        return <p className="text-center mt-10">Workspace not found</p>;
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-white shadow rounded-lg p-6 flex justify-between">
                <h1 className="text-3xl font-bold mb-2">{workSpaceDetail.title}</h1>{" "}
                <Button
                    onClick={() =>
                        router.push(`/workSpace/project/${workSpaceDetail?._id}`)
                    }
                >
                    View Projects
                </Button>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Members ({workSpaceDetail.members.length})
                </h2>
                <ul className="divide-y divide-gray-200">
                    {workSpaceDetail.members.map((member: any, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between py-3 hover:bg-gray-50 rounded px-2"
                        >
                            <div className="flex items-center cursor-pointer gap-4" onClick={() => router.push(`/workSpace/project/${workSpaceDetail?._id}/user/${member?.user}`)}>
                                <div className="w-10 h-10 bg-blue-200 text-blue-800 flex items-center justify-center rounded-full font-semibold">
                                    {member.firstName[0]}
                                    {member.lastName[0]}
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {member.firstName} {member.lastName}
                                    </p>
                                    <p className="text-gray-500 text-sm">{member.email}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                {member.role}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
