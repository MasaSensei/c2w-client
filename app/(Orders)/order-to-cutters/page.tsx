"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";

const OrderToCutterPage = () => {
  const headers = [
    "Order Date",
    "Due Date",
    "Invoice No.",
    "Total Items",
    "Status",
    "Remarks",
  ];
  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="Order To Cutters" />
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
