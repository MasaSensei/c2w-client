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
      fetchData();
    };
  }, []);

  const handleAdd = () => {
    setIsAdding(!isAdding);
  };
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
            data={[]}
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
