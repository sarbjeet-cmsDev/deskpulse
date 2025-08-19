"use client";
import React, { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";
import { SearchResponse } from "./types";
import { Button } from "../Form/Button";

export interface GlobalSearchProps {
  fetcher: (query: string) => Promise<SearchResponse>;
  placeholder?: string;
  minChars?: number;
}

export function GlobalSearch({
  fetcher,
  placeholder = "Search...",
  minChars = 1,
}: GlobalSearchProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      if (cmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>

      <Button
        type="button"
        className="w-full text-left border rounded px-3 py-2 bg-white hover:bg-gray-50"
        onClick={() => setOpen(true)}
      >
        {placeholder}
      </Button>


      <SearchModal
        open={open}
        onClose={() => setOpen(false)}
        fetcher={fetcher}
        placeholder={placeholder}
        minChars={minChars}
      />
    </>
  );
}
