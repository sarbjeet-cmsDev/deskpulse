"use client";
import React from "react";
import Link from "next/link";

interface ResultSectionProps {
  title: string;
  items: any[];
  type: "project" | "task" | "comment";
  onSelect?: () => void; 
}

const getCommentLink = (comment: any) => {
  if (comment.task) return `/task/${comment.task}?comment=${comment._id}`;
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
              ? `/project/${item._id}`
              : type === "task"
                ? `/task/${item._id}`
                : getCommentLink(item);

          
          return (
            <li key={item._id}>
              <Link
                href={href}
               
                onClick={onSelect}
                className="
                            block w-full rounded px-2 py-1
                            text-gray-800
                            hover:bg-gray-200 hover:text-theme-primary
                            focus:bg-gray-100 focus:text-theme-primary focus:outline-none
                            cursor-pointer
                            "
              >
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
