"use client";
import React, { useState, useEffect } from "react";
import { ReadonlyURLSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Pagination from "../Pagination/pagination";
import { Button } from "../Form/Button";

type Header = {
  id: string;
  title: string;
  is_sortable?: boolean;
};

type Row = {
  [key: string]: any;
  actions?: { title: string }[];
};

type Pagination = {
  current_page: number;
  total_page: number;
  total?: number;
  total_records: number;
  limit: number;
};

type DataGridProps = {
  headers: Header[];
  rows: Row[];
  pagination: Pagination;
  onSearch?: (query: string) => void;
  onAction?: (action: string, row: Row) => void;
  sort?: { field: string; order: "asc" | "desc" };
  onSort?: (field: string) => void;
  loading?: boolean;
  router: AppRouterInstance;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
};

const DataGrid: React.FC<DataGridProps> = ({
  headers,
  rows,
  pagination,
  onSearch,
  onAction,
  sort,
  onSort,
  loading,
  router,
  pathname,
  searchParams,
}) => {
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    if (onSearch) {
      const delay = setTimeout(() => onSearch(searchInput), 300);
      return () => clearTimeout(delay);
    }
  }, [searchInput]);
  const currentPageFromRoute = parseInt(searchParams.get("page") || "1", 10);


  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchInput("");
                onSearch?.("");
              }
            }}
            className="p-2 border rounded-md md:w-full md:max-w-md"
          />
          <Button
            onClick={() => {
              setSearchInput("");
              onSearch?.("");
            }}
            className="px-3 py-1 border rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 h-[42px]"
          >
            Clear
          </Button>
        </div>
      )}
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 min-w-[150px]"
                  onClick={() => header.is_sortable && onSort?.(header.id)}
                >
                  {header.title}
                </th>
              ))}
              {onAction && <th className="px-4 py-2 min-w-[120px]">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={headers.length + (onAction ? 1 : 0)}
                  className="p-4 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length + (onAction ? 1 : 0)}
                  className="p-4 text-center italic"
                >
                  No data available.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header.id} className="px-4 py-2">
                      {Array.isArray(row[header.id])
                        ? row[header.id].join(', ')
                        : row[header.id]}

                    </td>
                  ))}
                  {onAction && (
                    <td className="px-4 py-2 md:block flex flex-wrap">
                      {row.actions && row.actions.length > 0 ? (
                        row.actions.map((action, i) => (
                          <button
                            key={i}
                            className={`px-3 py-1 ml-2 mt-2 rounded mt-2 text-white text-sm ${action.title === "Delete"
                              ? "bg-red-500 hover:bg-red-600"
                              : "btn-primary"
                              }`}
                            onClick={() => onAction(action.title, row)}
                          >
                            {action.title}
                          </button>
                        ))
                      ) : (
                        <span className="text-gray-400 italic">No Actions</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      <Pagination
        currentPage={currentPageFromRoute}
        totalItems={pagination.total_records}
        itemsPerPage={pagination.total_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DataGrid;
