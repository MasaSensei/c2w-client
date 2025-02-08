"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";

interface TableProps {
  headers: string[];
  data: { [key: string]: string | number | boolean }[];
  onEdit?: (item: { [key: string]: string | number | boolean }) => void;
  onDelete?: (item: { [key: string]: string | number | boolean }) => void;
  onShow?: (item: { [key: string]: string | number | boolean }) => void;
  transfer?: (item: { [key: string]: string | number | boolean }) => void;
  details?: boolean;
  detailsHeaders?: string[];
  detailsTitle?: string;
  detailsRows?: string[][][];
  overflow?: string;
  checkbox?: boolean;
  onSelectionChange?: (selectedRows: string[][]) => void;
}

const TableDetails = ({
  headers,
  rows,
  title,
  chekbox,
  onSelectionChange, // Tambahkan prop untuk mengirim data ke parent
}: {
  headers: string[];
  rows: string[][][];
  title: string;
  chekbox?: boolean;
  onSelectionChange?: (selectedRows: string[][]) => void;
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const allSelected = chekbox && selectedRows.length === rows.flat().length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allRowIds = rows.flatMap((group, groupIndex) =>
        group.map((_, rowIndex) => `${groupIndex}-${rowIndex}`)
      );
      setSelectedRows(allRowIds);
      onSelectionChange?.(rows.flat());
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (
    groupIndex: number,
    rowIndex: number,
    checked: boolean
  ) => {
    const rowId = `${groupIndex}-${rowIndex}`;
    setSelectedRows((prev) =>
      checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)
    );

    // Ambil hanya baris yang terpilih
    const selectedData = checked
      ? [...selectedRows, rowId]
      : selectedRows.filter((id) => id !== rowId);

    // Kirim data yang sesuai ke parent
    const selectedDetails = selectedData.map((id) => {
      const [gIndex, rIndex] = id.split("-").map(Number);
      return rows[gIndex][rIndex];
    });

    onSelectionChange?.(selectedDetails);
  };

  return (
    <tr>
      <td colSpan={7} className="p-4 border-b">
        <div className="border bg-[#F6F7F9] p-4 rounded">
          <h4 className="text-sm font-semibold text-dark">{title}</h4>
          <div className="w-fit min-w-[500px] mt-4 border border-gray-200 rounded-lg">
            <table className="w-full text-xs text-left border-collapse rounded-lg bg-white overflow-hidden">
              <thead className="border-b bg-[#F6F7F9] text-[#758090]">
                <tr>
                  {chekbox && (
                    <th className="py-2 px-4 font-normal">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                  )}
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="py-2 px-4 font-normal"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((group, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    {group.map((row, rowIndex) => {
                      const rowId = `${groupIndex}-${rowIndex}`;
                      return (
                        <tr key={rowId}>
                          {chekbox && (
                            <td className="px-4 py-3 align-top">
                              <Checkbox
                                checked={selectedRows.includes(rowId)}
                                onCheckedChange={(checked) =>
                                  handleSelectRow(
                                    groupIndex,
                                    rowIndex,
                                    checked as boolean
                                  )
                                }
                              />
                            </td>
                          )}
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-3 border-b">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
};

const Table = ({
  headers,
  data,
  onShow,
  onEdit,
  onDelete,
  transfer,
  details,
  detailsHeaders,
  detailsTitle,
  detailsRows,
  overflow,
  checkbox,
  onSelectionChange,
}: TableProps) => {
  const [search, setSearch] = useState<Record<string, string>>({});
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [onClickedRowIndex, setClickedRowIndex] = useState<
    Record<number, boolean>
  >({});
  const rowsPerPage = 10;

  useEffect(() => {
    const initialSearch = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {} as Record<string, string>);
    setSearch(initialSearch);
  }, [headers]);

  useEffect(() => {
    let filteredData = data.filter((item) =>
      headers.every((header) => {
        const searchValue = search[header]?.toLowerCase() || "";
        const itemValue = String(item[header] || "").toLowerCase();
        return itemValue.includes(searchValue);
      })
    );

    // Sort berdasarkan config yang ada
    if (sortConfig) {
      filteredData = filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setSortedData(filteredData);
  }, [data, search, sortConfig, headers]);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    header: string
  ) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [header]: e.target.value,
    }));
  };

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (header: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === header &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key: header, direction });
  };

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  const handleRowDetails = (index: number) => {
    setClickedRowIndex((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));

    console.log("Row clicked:", index);
    console.log("Details Rows after click:", detailsRows);

    toggleDetails();
  };

  console.log("Details Rows for index", onClickedRowIndex, detailsRows);

  return (
    <div className={cn("flex flex-col w-full bg-[#F6F7F9]", overflow)}>
      <table
        className={cn(
          "min-w-full rounded-t-lg text-left bg-[#F6F7F9] text-[12px] font-light",
          overflow
        )}
      >
        <thead className="border-b text-[#758090]">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="cursor-pointer px-5 py-2.5 font-normal"
              >
                <button
                  type="button"
                  className="whitespace-nowrap"
                  onClick={() => handleSort(header)}
                >
                  {header}
                </button>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className={`inline ml-1 ${
                    sortConfig?.key === header
                      ? sortConfig.direction !== "asc"
                        ? "rotate-180"
                        : ""
                      : "rotate-0"
                  }`}
                  height="12"
                  width="12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0V0z"></path>
                  <path d="m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
                </svg>
              </th>
            ))}
          </tr>
          <tr className="text-black">
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 pb-2 font-normal text-left border-b"
              >
                <Input
                  type="text"
                  className="w-full bg-white px-2 py-2 border rounded-md text-xs"
                  value={search[header] ?? ""}
                  onChange={(e) => handleSearchChange(e, header)}
                  placeholder={`Cari ${header}`}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr className="border-b relative">
                  {headers.map((header, colIndex) => (
                    <td key={colIndex} className="relative px-5 py-4 align-top">
                      <span className="whitespace-nowrap">{item[header]}</span>
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-center align-top">
                    <div className="flex items-center gap-3">
                      {details && (
                        <button
                          type="button"
                          className="text-gray-600 transition ease-in-out duration-300 hover:opacity-60"
                          onClick={() => handleRowDetails(rowIndex)}
                        >
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 448 512"
                            height="12"
                            width="12"
                            className={`${
                              onClickedRowIndex[rowIndex] ? "rotate-180" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                          </svg>
                        </button>
                      )}
                      {transfer && (
                        <button
                          type="button"
                          className="text-gray-600 bg-gray-100 rounded p-1 transition ease-in-out duration-300 hover:opacity-60"
                          onClick={() => transfer?.(item)}
                        >
                          Transfer
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          className="text-gray-600 transition ease-in-out duration-300 hover:opacity-60"
                          onClick={() => onEdit?.(item)}
                        >
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 576 512"
                            height="12"
                            width="12"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="text-gray-600 transition ease-in-out duration-300 hover:opacity-60"
                          onClick={() => onDelete?.(item)}
                        >
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="14"
                            width="14"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9ZM9 12V18H11V12H9ZM13 12V18H15V12H13Z"></path>
                          </svg>
                        </button>
                      )}
                      {onShow && (
                        <button
                          type="button"
                          onClick={() => onShow?.(item)}
                          className="mr-1 text-gray-600 transition ease-in-out duration-300 hover:opacity-60"
                        >
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            height="13"
                            width="13"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z"></path>
                            <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                            <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"></path>
                            <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {details && onClickedRowIndex[rowIndex] && (
                  <TableDetails
                    headers={detailsHeaders?.flat() || []}
                    rows={detailsRows ? [[...detailsRows[rowIndex]]] : []}
                    title={detailsTitle || ""}
                    chekbox={checkbox}
                    onSelectionChange={onSelectionChange}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="relative px-5 text-center py-4 align-top"
              >
                Data tidak ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="my-4 mx-10">
        <PaginationContent className="flex items-center justify-between">
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          <span className="text-sm text-[#758090]">
            Page {currentPage} of {totalPages}
          </span>

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </div>
    </div>
  );
};

export default Table;
