"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { OutgoingBahanBakuService } from "@/services/outgoingBahanBaku.service";
import { OutgoingBahanBaku } from "@/types/outgoingBahanBaku";
import { useState, useEffect } from "react";

const OutgoingBahanBakuPage = () => {
  const [data, setData] = useState<OutgoingBahanBaku[]>([]);
  const headers = [
    "Date",
    "Bahan",
    "Total Roll",
    "Total Yard",
    "Status",
    "Remarks",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await OutgoingBahanBakuService.getAll();
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
      }
    };

    fetchData();
  }, []);

  const formatData = (data: OutgoingBahanBaku[]) => {
    return data.map((item) => ({
      Date: item.outgoing_date || "-",
      Bahan:
        `${item.bahanbaku?.code?.code} - ${item.bahanbaku?.color?.color} - ${item.bahanbaku?.item}` ||
        "-",
      "Total Roll": item.total_roll || 0,
      "Total Yard": item.total_yard || 0,
      Status:
        `${
          item.status === "cutting"
            ? "Cutting"
            : `Return (No. Invoice: ${item?.incoming_invoice_number})`
        }` || "-",
      Remarks: item.remarks || "-",
    }));
  };

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="Outgoing Stock Report (Bahan Baku)" />
      <section className="flex-1 p-4">
        <div className="bg-white border boder-gray-200 rounded-lg w-full relative">
          <div className="w-fit min-w-full sm:flex sm:justify-center">
            <Cores.Table headers={headers} data={formatData(data)} />
          </div>
        </div>
      </section>
    </Layouts.Main>
  );
};

export default OutgoingBahanBakuPage;
