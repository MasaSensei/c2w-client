"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useEffect, useState } from "react";
import AddStock from "./stock";
import { OrderToCuttersService } from "@/services/orderToCutters.service";
import { OrderToCutters } from "@/types/orderToCutters";

const OrderToCutterPage = () => {
  const [datas, setDatas] = useState<OrderToCutters[]>([]);
  const [detailsTable, setDetailsTable] = useState<string[][]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const headers = [
    "Order Date",
    "Due Date",
    "Invoice No.",
    "Total Items",
    "Status",
    "Remarks",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await OrderToCuttersService.getAll();
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

  const format = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatData = (data: OrderToCutters[]) => {
    return data.map((item) => ({
      "Order Date": item.order_date ? format(new Date(item.order_date)) : "-",
      "Due Date": item.due_date ? format(new Date(item.due_date)) : "-",
      "Invoice No.": item.invoice_number || "-",
      "Total Items": item.details?.length || 0,
      Status: item.status || "-",
      Remarks: item.remarks || "-",
    }));
  };
  const handleAdd = () => {
    setIsAdding(!isAdding);
  };

  const formatRupiah = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const formatDetailsData = (data: OrderToCutters[]) => {
    const formattedDetails: string[][] = [];

    data.forEach((item) => {
      if (!item.details?.length) {
        formattedDetails.push(["-", "-", "-", "-", "-", "-", "-"]);
      } else {
        item.details.forEach((detail) => {
          formattedDetails.push([
            detail.product_code || "-",
            detail.roll?.toString() || "0",
            detail.total_yard?.toString() || "0",
            formatRupiah(detail.cost_per_yard?.toString() || "0"),
            formatRupiah(detail.sub_total?.toString() || "0"),
            detail.inventory_bahan_baku_to_cutters?.status || "-",
            detail.remarks || "-",
          ]);
        });
      }
    });

    return formattedDetails;
  };

  useEffect(() => {
    if (!datas?.length) return;

    const detailsTable = formatDetailsData(datas);
    setDetailsTable(detailsTable);
  }, [datas]);

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions onAdd={handleAdd} title="Order To Cutters" />
      {isAdding && <AddStock onClose={handleAdd} />}
      <section className="flex-1 p-4">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <ClipLoader size={50} color="#007bff" />
            </div>
          ) : (
            )} */}
          <Cores.Table
            headers={headers}
            data={formatData(datas)}
            details={true}
            detailsHeaders={[
              "Product Code",
              "Total Roll",
              "Total Yards",
              "Cost per Yard",
              "Sub Total",
              "Status",
              "Remarks",
            ]}
            detailsRows={detailsTable}
            // data={formatData(data)}
            // onEdit={handleEdit}
            // onDelete={handleDelete}
            // transfer={handleTransfer}
          />
        </div>
      </section>
    </Layouts.Main>
  );
};

export default OrderToCutterPage;
