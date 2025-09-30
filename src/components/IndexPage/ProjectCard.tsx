"use client";

import { Card, CardBody } from "@heroui/react";
import CardHead from "./CardHeader";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ProjectImage from "@/assets/images/projectimage.png";
import AvatarList from "./avatarlist";
import { useState } from "react";
import { KanbanColumn } from "@/types/projectKanbon.interface";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import ProjectService from "@/service/project.service";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ProjectCardProps {
  project: {
    title: string;
    code: string;
    avatar?: string;
    notes?: string;
    url_live?: string;
    createdAt?: string;
    isFavorite?: string[];
    _id?: string;
  };
  kanban: KanbanColumn[];
  taskCounts: Record<string, number>;
  linkTo?: string;
  onFavoriteChange?: () => void;
}

export default function ProjectCard({
  project,
  kanban,
  taskCounts,
  linkTo,
  onFavoriteChange,
}: ProjectCardProps) {
  const pathname = usePathname();
  const user: any = useSelector((state: RootState) => state.auth.user);

  const [version, setVersion] = useState<number>(Date.now());
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    const favorites = Array.isArray(project?.isFavorite) ? project.isFavorite : [];
    return favorites.includes(user?._id || user?.id);
  });


  const avatarUrl = project?.avatar
    ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${project?.avatar}?v=${version}`
    : ProjectImage.src;

  const toggleFavorite = async (projectId: string) => {
    try {
      const userId = user?._id || user?.id;
      const currentlyFav = project.isFavorite?.includes(userId);

      let updatedFavorites: string[];
      if (currentlyFav) {
        updatedFavorites = project.isFavorite?.filter((id) => id !== userId) || [];
      } else {
        updatedFavorites = [...(project.isFavorite || []), userId];
      }

      await ProjectService.updateFavProject(projectId, {
        isFavorite: updatedFavorites,
      } as any);

      setIsFavorite(!currentlyFav);
      project.isFavorite = updatedFavorites;
       if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
    }
  };

  return (
    <Card className="!shadow-[0px_2px_36px_rgba(16,21,35,0.07)] py-[16px] px-[10px] rounded-[12px]">
      <CardBody className="p-0">
        <div className="flex justify-between items-center">
          {linkTo ? (
            <Link href={linkTo}>
              <CardHead title={project.title} />
            </Link>
          ) : (
            <CardHead title={project.title} />
          )}

          {pathname !== "/" && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(project._id as string);
              }}
              className="text-yellow-400 transition-transform"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? (
                <StarSolid className="w-5 h-5" />
              ) : (
                <StarOutline className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {linkTo ? (
          <Link href={linkTo}>
            <div className="mt-[14px] h-[200px] overflow-hidden border border-[#e3e3e35c] rounded-[8px] ">
              <Image
                src={avatarUrl}
                alt="project-image"
                className="rounded-[8px] min-w-[100%]"
                width={1200}
                height={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        ) : (
          <div className="mt-[14px] h-[200px] overflow-hidden border border-[#e3e3e35c] rounded-[8px] ">
            <Image
              src={avatarUrl}
              alt="project-image"
              className="rounded-[8px] min-w-[100%]"
              width={1200}
              height={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="mt-[14px] flex items-center gap-4">
          <AvatarList users={[]} />
        </div>
      </CardBody>
    </Card>
  );
}
