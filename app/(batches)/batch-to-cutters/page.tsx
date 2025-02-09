"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { BatchService } from "@/services/batch.service";
import { Batch } from "@/types/batch";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BatchToCuttersPage = () => {
  const [datas, setDatas] = useState<Batch[]>([]);
  const router = useRouter();
  const headers = [
    "Batch No",
    "Start Date",
    "End Date",
    "Total Items",
    "Status",
    "Remarks",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await BatchService.getAll({ type: "cutters" });
        if (res.data.data) {
          setDatas(res.data.data);
        } else {
          setDatas([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setDatas([]);
      }
    };

    fetchData();
  }, []);

  const handleShow = (item: Record<string, string | number | boolean>) => {
    const fullData = datas.find((d) => d.batch_number === item["Batch No"]);
    if (!fullData) {
      console.log("Data tidak ditemukan");
      return;
    }

    router.push(`/batch-to-cutters/${fullData.id}`);
  };

  const formatData = (data: Batch[]) => {
    return data.map((item) => ({
      "Batch No": item.batch_number || "-",
      "Start Date": item.start_date || "-",
      "End Date": item.end_date || "-",
      "Total Items": item.details?.length || 0,
      Status: item.status || "-",
      Remarks: item.remarks || "-",
    }));
  };
  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions
        title="Batch To Cutters"
        onAdd={() => {
          window.location.href = "/batch-to-cutters/create";
        }}
        stock={false}
      />
      <Layouts.SectionTable>
        <Cores.Table
          headers={headers}
          data={formatData(datas)}
          onShow={handleShow}
        />
      </Layouts.SectionTable>
    </Layouts.Main>
  );
};

export default BatchToCuttersPage;
