import React from "react";

type TableHeaderProps = {
  headers: string[];
};

type TableBodyProps = {
  rows: string[][];
};

interface ReusableTableProps {
  headers: string[];
  rows: string[][];
}

const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => {
  return (
    <thead className="rounded-t border-b bg-[#F6F7F9] text-[#758090]">
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

const TableBody: React.FC<TableBodyProps> = ({ rows }) => {
  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex} className="relative">
          {row.map((cell, cellIndex) => (
            <td key={cellIndex} className="relative px-6 py-4 align-top">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

const StockTable: React.FC<ReusableTableProps> = ({ headers, rows }) => {
  return (
    <table className="min-w-full text-left text-[12px] font-light">
      <TableHeader headers={headers} />
      <TableBody rows={rows} />
    </table>
  );
};

export default StockTable;
