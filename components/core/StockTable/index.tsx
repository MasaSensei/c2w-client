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
  onClick?: () => void;
  detail: string[][];
};

interface ReusableTableProps {
  headers: string[];
  rows: string[][];
  detail?: string[][];
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
        <tr>
          {rows.map((cell, cellIndex) => (
            <td key={cellIndex} className="px-4 py-3 text-center">
              {cell}
            </td>
          ))}
        </tr>
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

const TableBody: React.FC<TableBodyProps> = ({ rows, onClick, detail }) => {
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});

  const handleToggle = (rowIndex: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex], // Toggle hanya untuk baris yang diklik
    }));
  };

  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <tr className="relative bg-white">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="relative px-6 py-4 align-top">
                {cell}
              </td>
            ))}
            <td className="relative p-4 align-top">
              <div className="flex items-center justify-center gap-8 py-1">
                <button
                  type="button"
                  onClick={() => handleToggle(rowIndex)} // Klik hanya mempengaruhi baris ini
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
              </div>
            </td>
          </tr>
          {openRows[rowIndex] && (
            <tr className="border-t">
              <td colSpan={7} className="p-4 bg-white">
                <div className="border bg-[#F6F7F9] p-4 rounded">
                  <h4 className="text-sm font-semibold text-dark">
                    Roll Items:
                  </h4>
                  <div className="w-fit mt-4 border border-gray-200 rounded-lg">
                    <DetailTable rows={detail} />
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
}) => {
  return (
    <table className="min-w-full text-left text-[12px]  bg-[#F6F7F9] font-light">
      <TableHeader headers={headers} />
      <TableBody
        rows={rows}
        detail={detail || []}
        onClick={() => {
          console.log("clicked");
        }}
      />
    </table>
  );
};

export default StockTable;
