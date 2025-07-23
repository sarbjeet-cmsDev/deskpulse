"use client";

import { useState } from "react";
import "./descriptionView.css"; 
interface DescriptionViewProps {
  html: string;
  maxLines?: number;
  showToggle?: boolean; 
}

export default function DescriptionView({
  html,
  maxLines = 4,
  showToggle = true,
}: DescriptionViewProps) {
  const [expanded, setExpanded] = useState(false);

  
  const stripHtml = (content: string): string =>
    content.replace(/<[^>]*>/g, "").trim();

  return (
    <div>
      <div
        className={`description-content ${
          expanded ? "" : `clamp-${maxLines}-lines`
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {showToggle && stripHtml(html).length > 300 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 mt-2 text-sm font-medium hover:underline"
        >
          {expanded ? "Show Less" : "Read More..."}
        </button>
      )}
    </div>
  );
}
