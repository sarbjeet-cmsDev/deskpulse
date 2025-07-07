"use client";

import {Card, CardBody} from "@heroui/react";
import CardHead from "./CardHeader";
import CardMetaTag from "./CardMetaItem";
import Image from "next/image";
import ProjectImage from "@/assets/images/projectimage.png";
import AvatarList from "./avatarlist";
import ProgressBar from "./progress";


interface ProjectCardProps {
  project: {
    code: string;
    avatar?: string;
    notes?: string;
    url_live?: string;
    createdAt?: string;
    // add other fields if needed
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    
      <Card className=" !shadow-[0px_2px_36px_rgba(16,21,35,0.07)] py-[16px] px-[10px] rounded-[12px]">
        <CardBody className="p-0">
          <CardHead title={project.code} />
          <div className="mt-[14px]">
            <div className="flex items-center gap-2"> 
              <CardMetaTag date={project.createdAt}/>
            </div>
            <div className="mt-[14px]  h-[135px] overflow-hidden border border-[#e3e3e35c] rounded-[8px]">
              <Image src={ProjectImage} alt="project-image" className="rounded-[8px]"/>
            </div>
          </div>
          <div className="mt-[14px] flex items-center gap-4" >
            <AvatarList/>
            <div className="box-progress flex-grow">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-[#31394f99] text-[10px] leading-[16px]">Progress</span>
                  <span className="text-[10px] leading-[16px] font-600">78%</span>
              </div>
              <ProgressBar/>
            </div>
          </div>
        </CardBody>
      </Card>
  );
}