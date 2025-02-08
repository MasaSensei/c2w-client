"use client";

import { useState, useEffect } from "react";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { Path, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cores } from "@/components/core";
import { OrderToCutters } from "@/types/orderToCutters";
import { OrderToCuttersService } from "@/services/orderToCutters.service";
import StepNavigation from "./stepNavigation";

const formSchema = z.object({
  batch_no: z.string().min(1, { message: "Batch No is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

const CreateBatchToCuttersPage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [orderToCutters, setOrderToCutters] = useState<OrderToCutters[]>([]);
  const [detailsTable, setDetailsTable] = useState<string[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await OrderToCuttersService.getAll();
        if (res.data.data) {
          setOrderToCutters(res.data.data);
        } else {
          setOrderToCutters([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setOrderToCutters([]);
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batch_no: "",
      status: "New",
    },
  });

  const fields = [
    {
      label: "Batch No",
      name: "batch_no",
      placeholder: "Batch No",
      type: "text",
    },
    {
      label: "Status",
      name: "status",
      placeholder: "status",
      type: "text",
      readOnly: true,
    },
    {
      label: "Start Date",
      name: "start_date",
      placeholder: "Start Date",
      type: "date",
    },
    {
      label: "End Date",
      name: "end_date",
      placeholder: "Batch No",
      type: "date",
    },
    {
      label: "Remarks",
      name: "remarks",
      placeholder: "Remarks",
      type: "textarea",
    },
  ];

  const formatRupiah = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const formatDetailsData = (data: OrderToCutters[]) => {
    return data.map((item) => [
      item?.details?.map((detail) => detail?.product_code) || "-",
      item?.details?.map((detail) => detail?.roll) || 0,
      item?.details?.map((detail) => detail?.total_yard) || 0,
      item?.details?.map((detail) =>
        formatRupiah(detail?.cost_per_yard?.toString() || "-")
      ) || 0,
      item?.details?.map((detail) =>
        formatRupiah(detail?.sub_total?.toString() || "-")
      ) || 0,
      item?.details?.map(
        (detail) => detail?.inventory_bahan_baku_to_cutters?.status
      ) || "-",
      item?.details?.map((detail) => detail?.remarks) || "-",
    ]);
  };

  useEffect(() => {
    if (!orderToCutters?.length) return;

    const detailsTable = formatDetailsData(orderToCutters);
    setDetailsTable(detailsTable as string[][]);
  }, [orderToCutters]);

  const steps = [
    { id: 1, label: "Main Info" },
    { id: 2, label: "Select Items" },
    { id: 3, label: "Summary" },
  ];

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="Create Batch To Cutters" />
      <section className="flex-1 overflow-auto">
        <div className="mt-6 mb-8 max-w-lg mx-auto">
          <div className="relative">
            <StepNavigation
              steps={steps}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
        {/* Tab Content */}
        {activeTab === 1 && (
          <div className="bg-white rounded-lg p-6 mb-6 border mx-auto max-w-3xl space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Main Info</h2>
            <Layouts.Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      field.type === "textarea" && "col-span-2"
                    }`}
                  >
                    <Fragments.ControllerInput
                      {...field}
                      name={field.name as Path<z.infer<typeof formSchema>>}
                      control={control}
                      errors={errors}
                      readonly={field.readOnly}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="bg-green-500 col-span-2 text-white hover:opacity-50 transition duration-300 px-3 py-1.5 rounded"
                >
                  Next
                </button>
              </div>
            </Layouts.Form>
          </div>
        )}
        {activeTab === 2 && (
          <div className="mb-6 mx-4 grid grid-cols-10 gap-4">
            <div className="col-span-8 space-y-4">
              <div className="border space-y-4 bg-white rounded-lg p-6">
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Select Order Items
                  </h2>
                </div>
                <Cores.Table
                  overflow="overflow-x-auto"
                  headers={[
                    "Order Date",
                    "Due Date",
                    "Invoice No.",
                    "Total Items",
                    "Status",
                    "Remarks",
                  ]}
                  data={formatData(orderToCutters)}
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
                  checkbox={true}
                />
              </div>
            </div>
            <div className="border bg-white rounded-lg p-6 col-span-2 h-fit">
              <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
              <div className="text-sm my-4 grid space-y-2">
                <div>No Item Selected</div>
              </div>
              <button className="mt-2 w-full px-4 py-2 bg-slate-900 text-white text-sm rounded shadow hover:opacity-50 transition ease-in-out duration-300">
                Next
              </button>
            </div>
          </div>
        )}
        {activeTab === 3 && (
          <div className="mx-4">
            <div className="border bg-white rounded-lg max-w-2xl mx-auto">
              <div className="p-6 rounded-t border-b border-b-gray-400">
                <h2 className="text-xl font-semibold text-gray-800">
                  Batch Details
                </h2>
                <div className="mt-4 flex gap-10 text-sm">
                  <div>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Batch No:
                      </span>
                    </p>
                    <p>-</p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Status:
                      </span>
                    </p>
                    <p>New</p>
                  </div>
                </div>
                <div className="p-6">
                  <section className="flex-1 overflow-auto w-full">
                    <div className="bg-neutral-200 border border-gray-200 rounded-lg w-full relative">
                      <Cores.Table
                        data={[]}
                        headers={["Product Code", "Total Qty"]}
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layouts.Main>
  );
};

export default CreateBatchToCuttersPage;
