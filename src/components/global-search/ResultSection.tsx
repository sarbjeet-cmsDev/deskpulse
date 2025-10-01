"use client";
import React from "react";
import Link from "next/link";
import { SearchIcon } from "../icons";

interface ResultSectionProps {
  title: string;
  items: any[];
  type: "project" | "task" | "comment";
  onSelect?: () => void;
}

const getCommentLink = (comment: any) => {
  if (comment.task) return `/task/${comment.code}?comment=${comment._id}`;
  if (comment.project)
    return `/project/${comment.project}?comment=${comment._id}`;
  return "#";
};

export function ResultSection({
  title,
  items,
  type,
  onSelect,
}: ResultSectionProps) {
  if (!items?.length) return null;

  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item: any) => {
          const href =
            type === "project"
              ? `/project/${item.code}`
              : type === "task"
                ? `/task/${item.code}`
                : getCommentLink(item);


          return (
            <li key={item._id} className="block w-full rounded px-2 py-1
                            text-gray-800
                            hover:bg-sky-100 hover:text-theme-primary
                            focus:bg-sky-100 focus:text-theme-primary focus:outline-none
                            cursor-pointer break-all overflow-hidden">
              <Link
              href={href}
              onClick={onSelect}
              className="flex
              block w-full rounded px-2 py-1
              text-gray-800
              hover:bg-sky-100 hover:text-theme-primary
              focus:bg-sky-100 focus:text-theme-primary focus:outline-none
              cursor-pointer break-all overflow-hidden
              "
              >
                <div className="mt-1 mr-2">
                <SearchIcon/>
                </div>
                {type === "comment"
                  ? stripHtml(item.content).slice(0, 30) + "..."
                  : item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


function stripHtml(html: string = ""): string {
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
