"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { InventoryBahanBakuToCuttersService } from "@/services/inventoyBahanBakuToCutters.service";
import { InventoryBahanBakuToCutters } from "@/types/inventoryBahanBakuToCutters";
import { useState, useEffect } from "react";

const ToCuttersPage = () => {
  const [data, setData] = useState<InventoryBahanBakuToCutters[]>([]);
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
        const res = await InventoryBahanBakuToCuttersService.getAll();
        if (res.data.data) {
          setData(res.data.data);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
      }
    };

    fetchData();
  }, []);

  const formatData = (data: InventoryBahanBakuToCutters[]) => {
    return data.map((item) => ({
      Date: item.transfer_date || "-",
      Bahan: item?.item || "-",
      "Total Roll": item?.total_roll || 0,
      "Total Yard": item?.total_yard || 0,
      Status: item.status || "-",
      Remarks: item.remarks || "-",
    }));
  };

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="To Cutters" />
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

export default ToCuttersPage;
