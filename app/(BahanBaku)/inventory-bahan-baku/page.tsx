"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { BahanBaku } from "@/types/bahanBaku";
import { BahanBakuService } from "@/services/bahanBaku.service";

const InventoryBahanBaku = () => {
  const [data, setData] = useState<BahanBaku[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const headers = [
    "Code",
    "Color",
    "Category",
    "Total Roll",
    "Total Yard",
    "Cost per Yard",
    "Remarks",
  ];

  useEffect(() => {
    BahanBakuService.getAll()
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error("Error fetching bahan baku:", err));
  }, []);

  const formatRupiah = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const formatData = (data: BahanBaku[]) => {
    return data.map((item) => ({
      Code: item?.code?.code || "-",
      Color: item.color.color || "-",
      Category: item.category.map((cat) => cat.category).join(", ") || "-",
      "Total Roll": item.total_roll || 0,
      "Total Yard": item.total_yard || 0,
      "Cost per Yard": formatRupiah(item.cost_per_yard || 0),
      Remarks: item.remarks || "-",
    }));
  };

  console.log(formatData(data));
  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions
        title="Inventory Bahan Baku"
        onFilter={() => {}}
        onAdd={() => {}}
      />
      <section className="flex-1 p-4">
        <div className="bg-white border boder-gray-200 rounded-lg w-full relative">
          <div className="w-fit min-w-full sm:flex sm:justify-center">
            {/* {loading && <ClipLoader color="black" />} */}
            <Cores.Table
              onEdit={() => {}}
              headers={headers}
              data={formatData(data)}
              onDelete={() => {}}
            />
          </div>
        </div>
      </section>
    </Layouts.Main>
  );
};

export default InventoryBahanBaku;
