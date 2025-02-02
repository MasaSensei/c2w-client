"use client";

import React from "react";
import { useState } from "react";

type TableHeaderProps = {
  headers: string[];
};

type DetailTableProps = {
  rows: string[][];
};

type TableBodyProps = {
  rows: string[][];
  onClick?: (rowIndex: number) => void; // Mengubah onClick untuk menerima rowIndex
  detail: string[][][];
  onDelete: (rowIndex: number) => void;
  onEdit: (rowIndex: number) => void;
};

interface ReusableTableProps {
  headers: string[];
  rows: string[][];
  detail?: string[][][];
  onEdit?: (rowIndex: number) => void; // onEdit sekarang menerima rowIndex
  onDelete?: (rowIndex: number) => void; // onDelete sekarang menerima rowIndex
}

const DetailTable: React.FC<DetailTableProps> = ({ rows }) => {
  return (
    <table className="w-fit text-xs text-left border-collapse rounded-lg bg-white overflow-hidden">
      <thead className="border-b bg-[#F6F7F9] text-[#758090]">
        <tr>
          <th scope="col" className="py-2 px-12 font-normal text-center">
            Jumlah Roll
          </th>
          <th scope="col" className="py-2 px-12 font-normal text-center">
            Length in Yard
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-4 py-3 text-center">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => {
  return (
    <thead className="rounded-t border-b text-[#758090]">
      <tr>
        {headers.map((header, index) => (
          <th key={index} scope="col" className="px-6 py-2 font-normal">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({
  rows,
  detail,
  onDelete,
  onEdit,
  onClick, // Pastikan onClick diterima di sini
}) => {
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});

  const handleToggle = (rowIndex: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex], // Toggle hanya untuk baris yang diklik
    }));
  };

  const handleDeleteClick = (rowIndex: number) => {
    if (onDelete) {
      onDelete(rowIndex);
    }
  };

  const handleEditClick = (rowIndex: number) => {
    if (onEdit) {
      onEdit(rowIndex);
    }
  };

  const handleRowClick = (rowIndex: number) => {
    if (onClick) {
      onClick(rowIndex); // Memanggil onClick dengan rowIndex
    }
  };

  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <tr
            className="relative bg-white"
            onClick={() => handleRowClick(rowIndex)}
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="relative border-b px-6 py-4 align-top"
              >
                {cell}
              </td>
            ))}
            <td className="relative p-4 align-top">
              <div className="flex items-center justify-center gap-8 py-1">
                <button
                  type="button"
                  onClick={() => handleToggle(rowIndex)}
                  className="text-gray-700 px-2 hover:opacity-50 transition duration-300"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="12"
                    width="12"
                    className={`${openRows[rowIndex] ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditClick(rowIndex)}
                    className="hover:opacity-50 transition duration-300"
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
                      <path d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(rowIndex)}
                    className="hover:opacity-50 transition duration-300"
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="0"
                      viewBox="0 0 15 15"
                      height="14"
                      width="14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </td>
          </tr>
          {openRows[rowIndex] && (
            <tr className="border-t">
              <td colSpan={10} className="p-4 bg-white">
                <div className="border bg-[#F6F7F9] p-4 rounded">
                  <h4 className="text-sm font-semibold text-dark">
                    Roll Items:
                  </h4>
                  <div className="w-fit mt-4 border border-gray-200 rounded-lg">
                    <DetailTable rows={detail[rowIndex] || []} />
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  );
};

const StockTable: React.FC<ReusableTableProps> = ({
  headers,
  rows,
  detail,
  onDelete,
  onEdit,
}) => {
  // Menyediakan default function untuk onDelete dan onEdit jika undefined
  const handleDelete = onDelete ?? (() => {}); // Default no-op function jika undefined
  const handleEdit = onEdit ?? (() => {}); // Default no-op function jika undefined

  return (
    <table className="min-w-full text-left text-[12px] bg-[#F6F7F9] font-light">
      <TableHeader headers={headers} />
      <TableBody
        rows={rows}
        detail={detail || []}
        onClick={() => {
          console.log("clicked");
        }}
        onEdit={handleEdit} // Gunakan handleEdit dengan default function jika undefined
        onDelete={handleDelete} // Gunakan handleDelete dengan default function jika undefined
      />
    </table>
  );
};

export default StockTable;
