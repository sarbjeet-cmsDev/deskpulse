import React, { useState, useEffect, KeyboardEvent } from "react";

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
  total_records: number;
  limit: number;
};

type DataGridProps = {
  headers: Header[];
  rows: Row[];
  pagination: Pagination;
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onAction?: (action: string, row: Row) => void;
  sort?: { field: string; order: "asc" | "desc" };
  onSort?: (field: string) => void;
  loading?: boolean;
};

const DataGrid: React.FC<DataGridProps> = ({
  headers,
  rows,
  pagination,
  onSearch,
  onPageChange,
  onAction,
  sort,
  onSort,
  loading,
}) => {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (onSearch) {
      const delay = setTimeout(() => onSearch(searchInput), 300);
      return () => clearTimeout(delay);
    }
  }, [searchInput]);

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(searchInput);
    }
  };

  const startRecord = (pagination.current_page - 1) * pagination.limit + 1;
  const endRecord = Math.min(
    startRecord + pagination.limit - 1,
    pagination.total_records
  );

  const pageNumbers = Array.from(
    { length: pagination.total_page },
    (_, i) => i + 1
  );

  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="p-2 border rounded-md w-full max-w-md"
          />
          <button
            onClick={() => {
              setSearchInput("");
              onSearch?.("");
            }}
            className="px-3 py-1 border rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 h-[42px]"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
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
                  {/* {sort?.field === header.id && (
                    <span>{sort.order === 'asc' ? ' 🔼' : ' 🔽'}</span>
                  )} */}
                </th>
              ))}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  className="p-4 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1} className="p-4 text-center">
                  No data available.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header.id} className="px-4 py-2">
                      {row[header.id]}
                    </td>
                  ))}
                  <td className="px-4 py-2 space-x-2 flex">
                   
                    {row.actions && row.actions.length > 0 ? (
                      row.actions.map((action, i) => (
                        <button
                          key={i}
                          className={`px-3 py-1 rounded text-white text-sm ${
                            action.title === "Delete"
                              ? "bg-red-500 hover:bg-red-600"
                              : "btn-primary"
                          }`}
                          onClick={() => onAction?.(action.title, row)}
                        >
                          {action.title}
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">No Actions</span>
                    )}
                   
                  </td>
                </tr>
              ))
            )}
            
          </tbody>
        </table>
      </div>

      {/* Pagination Info + Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-sm text-gray-600">
          Showing {startRecord}–{endRecord} of {pagination.total_records}
        </div>
        <div className="flex items-center flex-wrap gap-1 text-sm">
          <button
            onClick={() => onPageChange?.(pagination.current_page - 1)}
            disabled={pagination.current_page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => onPageChange?.(num)}
              className={`px-3 py-1 border rounded ${
                num === pagination.current_page
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => onPageChange?.(pagination.current_page + 1)}
            disabled={pagination.current_page >= pagination.total_page}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
