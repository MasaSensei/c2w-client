"use client";

import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { IncomingBahanBaku as IncomingBahanBakuType } from "@/types/incomingBahanBaku";
import { IncomingBahanBakuService } from "@/services/incomingBahanBaku.service";
import { useState, useEffect } from "react";
import { Cores } from "@/components/core";
import { ClipLoader } from "react-spinners";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const IncomingBahanBaku = () => {
  const [data, setData] = useState<IncomingBahanBakuType[]>([]);
  const [selectedData, setSelectedData] =
    useState<IncomingBahanBakuType | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    IncomingBahanBakuService.getAll()
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const headers = ["Invoice Date", "Invoice Number", "Supplier", "Total Item"];

  const formatData = (data: IncomingBahanBakuType[]) => {
    return data.map((item) => ({
      "Invoice Date": item.invoice_date
        ? format(new Date(item.invoice_date), "dd/MM/yyyy")
        : "-",
      "Invoice Number": item.invoice_number || "-",
      Supplier: item.suppliers?.name || "-",
      "Total Item": item.details?.length || 0,
    }));
  };

  const handleShow = (item: Record<string, string | number | boolean>) => {
    const fullData = data.find(
      (d) => d.invoice_number === item["Invoice Number"]
    );

    if (!fullData) {
      console.log("Data tidak ditemukan");
      return;
    }
    setSelectedData(fullData);

    router.push(`/inventory-bahan-baku/incoming/${fullData.id}`);
  };

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="Incoming Stock (Bahan Baku)" />
      <section className="flex-1 p-4">
        <div className="bg-white border boder-gray-200 rounded-lg w-full relative">
          <div className="w-fit min-w-full sm:flex sm:justify-center">
            {loading && <ClipLoader color="black" />}
            <Cores.Table
              onShow={handleShow}
              headers={headers}
              data={formatData(data)}
            />
          </div>
        </div>
      </section>
    </Layouts.Main>
  );
};

export default IncomingBahanBaku;
