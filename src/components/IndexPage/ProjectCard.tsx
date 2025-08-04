"use client";

import { Card, CardBody } from "@heroui/react";
import CardHead from "./CardHeader";
import CardMetaTag from "./CardMetaItem";
import Image from "next/image";
import ProjectImage from "@/assets/images/projectimage.png";
import AvatarList from "./avatarlist";
import ProgressBar from "./progress";
import { useState } from "react";
import { KanbanColumn } from "@/types/projectKanbon.interface";

interface ProjectCardProps {
  project: {
    title: string;
    code: string;
    avatar?: string;
    notes?: string;
    url_live?: string;
    createdAt?: string;
    // add other fields if needed
  };
  kanban: KanbanColumn[];
  taskCounts: Record<string, number>;
}

export default function ProjectCard({
  project,
  kanban,
  taskCounts,
}: ProjectCardProps) {
  const [version, setVersion] = useState<number>(Date.now());
  const avatarUrl = project?.avatar
    ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${project?.avatar}?v=${version}`
    : ProjectImage.src;
  return (
    <Card className=" !shadow-[0px_2px_36px_rgba(16,21,35,0.07)] py-[16px] px-[10px] rounded-[12px]">
      <CardBody className="p-0">
        <CardHead title={project.title} />
        <div className="mt-[14px]">
          <div className="flex items-center gap-2">
            <CardMetaTag date={project.createdAt} />
          </div>
          <div className="mt-[14px] h-[200px] overflow-hidden border border-[#e3e3e35c] rounded-[8px] ">
            <Image
              src={avatarUrl}
              alt="project-image"
              className="rounded-[8px]"
              width={1200}
              height={100}
              // fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
        <div className="mt-[14px] flex items-center gap-4">
          <AvatarList users={[]} />
          <div className="flex gap-2 mt-4">
            {kanban.map((col) => (
              <div
                key={col._id}
                className="flex justify-between text-sm text-gray-700 py-1"
              >
                <span className="font-bold">{col.title}</span>
                <span> : {taskCounts[col.title] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
