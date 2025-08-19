"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ResultSection } from "./ResultSection";
import { SearchResponse } from "./types";
import { useDebounce } from "./hooks/useDebounce";
import { usePathname } from "next/navigation";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  fetcher: (query: string) => Promise<SearchResponse>;
  placeholder?: string;
  minChars?: number;
}

export function SearchModal({
  open,
  onClose,
  fetcher,
  placeholder = "Search tasks, projects, comments...",
  minChars = 1,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();


  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setResults(null);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      onClose();
    }
  }, [pathname]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!open) return;
    if (q.length < minChars) {
      setResults(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetcher(q)
      .then((res) => {
        if (!cancelled) setResults(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open, minChars, fetcher]);


  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);


  const overlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };


  const handleSelect = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 md:flex items-start justify-center z-50 p-4"
      onMouseDown={overlayClick}
    >
      <div
        className="bg-white rounded-xl shadow-lg overflow-auto w-full md:max-w-lg p-6 max-w-[330px] relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close search"
        >
          ✕
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="md:w-full border px-3 py-2 rounded mb-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading ? (
          <p>Searching...</p>
        ) : results ? (
          <>
            <ResultSection
              title="Projects"
              items={results.projects}
              type="project"
              onSelect={handleSelect}
            />
            <ResultSection
              title="Tasks"
              items={results.tasks}
              type="task"
              onSelect={handleSelect}
            />
            <ResultSection
              title="Comments"
              items={results.comments}
              type="comment"
              onSelect={handleSelect}
            />
          </>
        ) : (
          <p className="text-sm text-gray-500">
            {query.trim().length < minChars
              ? `Type at least ${minChars} characters to search.`
              : "No results."}
          </p>
        )}
      </div>
    </div>
  );
}
