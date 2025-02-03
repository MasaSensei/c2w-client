"use client";

import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useState, useEffect } from "react";
import { IncomingBahanBakuService } from "@/services/incomingBahanBaku.service";
import { IncomingBahanBaku } from "@/types/incomingBahanBaku";
import { usePathname } from "next/navigation";
import { Cores } from "@/components/core";

const ShowIncomingBahanBaku = () => {
  const [data, setData] = useState<IncomingBahanBaku | null>(null);
  const [detailsTable, setDetailsTable] = useState<string[][][]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchIncomingBahanBaku = async () => {
      try {
        const response = await IncomingBahanBakuService.getOne(
          pathname.split("/").pop() as string
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchIncomingBahanBaku();
  }, [pathname]);

  const formatRupiah = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  useEffect(() => {
    if (!data?.details) return;

    // Ambil daftar bahan dan detailnya
    const newRows = data.details.map((detail) => [
      `${detail.bahan_baku?.code?.code} - ${detail.bahan_baku?.color?.color} - ${detail.bahan_baku?.item}`,
      detail.roll?.toString() || "-",
      detail.total_yard?.toString() || "-",
      formatRupiah(detail.cost_per_yard || "0"),
      formatRupiah(detail.sub_total || "0"),
      detail.remarks || "-",
    ]);

    setRows(newRows);

    const newDetailsTable = data.details.map((detail) => [
      [detail.roll?.toString() || "-", detail.length_yard?.toString() || "-"],
    ]);

    setDetailsTable(newDetailsTable);
  }, [data]);

  console.log(detailsTable);
  const details = [
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="14"
          width="14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path>
        </svg>
      ),
      title: "Invoice Date",
      value: data?.invoice_date,
    },
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 384 512"
          height="12"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M288 256H96v64h192v-64zm89-151L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8V72zm0 64c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8v-16zm256 304c0 4.42-3.58 8-8 8h-80c-4.42 0-8-3.58-8-8v-16c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16zm0-200v96c0 8.84-7.16 16-16 16H80c-8.84 0-16-7.16-16-16v-96c0-8.84 7.16-16 16-16h224c8.84 0 16 7.16 16 16z"></path>
        </svg>
      ),
      title: "Invoice No ",
      value: data?.invoice_number,
    },
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="14"
          width="14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.5a5.25 5.25 0 0 0-2.519 9.857 9.005 9.005 0 0 0-6.477 8.37.75.75 0 0 0 .727.773H20.27a.75.75 0 0 0 .727-.772 9.005 9.005 0 0 0-6.477-8.37A5.25 5.25 0 0 0 12 2.5Z"></path>
        </svg>
      ),
      title: "Supplier ",
      value: data?.suppliers?.name,
    },
  ];

  const headers = [
    "Bahan",
    "Total Roll",
    "Total Yard",
    "Price per Yard",
    "Sub Total",
    "Remarks",
  ];

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="Incoming Stock Report (Bahan Baku) Details" />
      <section className="flex-1 bg-gray-50 overflow-auto p-4">
        <div className="overflow-auto border rounded bg-white">
          <div className="bg-gray-100 p-4 grid grid-cols-3 gap-4 text-sm text-dark">
            {details.map((detail, index) => (
              <div key={index} className="flex gap-1.5 items-center">
                {detail.icon}
                <label className="block font-medium">{detail.title}:</label>
                <span className="font-semibold">{detail.value}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="col-span-4 p-4">
            <div className="flex justify-between gap-4 items-center mb-4 text-gray-700">
              <div className="flex items-center gap-1.5">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="14"
                  width="14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M165.446 34.793c-23.17.023-45.634 12.97-54.612 36.323l-83.67 326.167c-12.673 94.537 81.04 88.742 137.957 65.396 81.422-33.396 181.723-29.213 263.244-8.26l6.45-17.218c-7.38-2.638-15.334-5.988-22.252-8.039.473-4.364.955-8.72 1.437-13.074l23.038 4.118 3.234-18.1c-8.074-1.441-16.147-2.885-24.221-4.328.615-5.403 1.238-10.799 1.87-16.189l22.134 3.278 2.693-18.186c-7.548-1.12-15.098-2.238-22.647-3.355.456-3.765.91-7.53 1.375-11.29 7.615 1.092 15.231 2.183 22.847 3.273l2.607-18.2-23.164-3.316c.46-3.593 1.29-9.988 1.76-13.577l22.781 2.55 2.045-17.57c-7.467-.834-14.935-1.671-22.402-2.508.783-5.767 1.917-11.182 2.728-16.943 7.67 1.12 15.341 2.244 23.012 3.368l2.31-17.139c-7.683-1.127-15.366-2.25-23.05-3.374.792-5.415 1.252-10.129 2.071-15.542 7.074 1.264 14.149 2.528 21.223 3.79l3.232-18.1-21.654-3.866c.736-4.676 1.473-9.35 2.23-14.026 6.978 1.673 13.955 3.347 20.932 5.022L465.276 208c-7.401-1.778-14.803-3.554-22.204-5.33a2809.25 2809.25 0 0 1 2.132-12.477c6.98 1.583 13.961 3.165 20.942 4.746l4.064-17.93c-7.271-1.65-14.543-3.298-21.815-4.946.769-4.267 1.55-8.535 2.342-12.805l20.742 5.151 4.431-17.843-21.751-5.405c.741-3.847 1.494-7.696 2.254-11.548l20.28 5.014 4.413-17.849-21.057-5.207a2444.47 2444.47 0 0 1 2.571-12.374c8.386 2.41 13.13 2.364 21.41 4.99L486 88.456c-83.808-26.776-179.25-33.22-244.192-6.453-24.337 114.036-37.305 221.4-68.032 338.64-3.407 13-14.47 21.89-27.342 28.064-27 11.608-64.033 13.778-84.63-4.91-10.971-10.34-16.174-27.036-12.467-47.579 2.303-12.762 10.883-21.986 20.834-26.378 19.749-7.074 43.492-4.25 58.893 7.95 12.463 9.302 12.318 38.283-3.882 31.82-9.639-6.17-1.964-11.851-8.615-17.378-11.6-7.428-26.42-10.872-38.972-5.57-5.564 2.455-8.887 5.737-10.166 12.822-2.94 16.29.685 24.996 6.985 30.933 18.333 13.49 45.279 10.495 64.068 1.712 10.045-4.82 16.277-11.436 17.511-16.147 30.538-116.518 43.443-224.123 68.293-339.964-11.796-28.344-35.67-41.247-58.84-41.225z"></path>
                </svg>
                <p className="block text-sm font-medium">Items</p>
              </div>
              <p className="block text-sm font-medium">
                <span>Total: </span>
                <span>{data?.details?.length}</span>
                <span>
                  {data?.details && data?.details?.length > 1
                    ? " Items"
                    : " Item"}
                </span>
              </p>
            </div>
            <div className="overflow-auto border border-gray-200 rounded">
              <Cores.StockTable
                detail={detailsTable}
                headers={headers}
                rows={rows}
              />
            </div>
          </div>
        </div>
      </section>
    </Layouts.Main>
  );
};

export default ShowIncomingBahanBaku;
