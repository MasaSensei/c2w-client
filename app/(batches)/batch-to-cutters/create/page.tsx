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
import { BatchService } from "@/services/batch.service";

const formSchema = z.object({
  batch_no: z.string().min(1, { message: "Batch No is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  start_date: z.string().min(1, { message: "Order Date is required" }),
  end_date: z.string().min(1, { message: "Due Date is required" }),
  order_no: z.string().min(1, { message: "Order No is required" }),
  remarks: z.string(),
});

const CreateBatchToCuttersPage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [orderToCutters, setOrderToCutters] = useState<OrderToCutters[]>([]);
  const [detailsTable, setDetailsTable] = useState<string[][][]>([]);
  const [selectedDetails, setSelectedDetails] = useState<string[][]>([]);

  const handleSelectionChange = (selectedRows: string[][]) => {
    const mergedMap = new Map<string, string[]>(); // Key: product_code

    selectedRows.forEach((row) => {
      const productCode = row[0];
      const roll = Number(row[1]);
      const totalYard = Number(row[2]);
      const costPerYard = Number(row[3].replace(/[^\d]/g, ""));
      const subTotal = Number(row[4].replace(/[^\d]/g, ""));

      if (mergedMap.has(productCode)) {
        const existingRow = mergedMap.get(productCode)!;
        existingRow[1] = (Number(existingRow[1]) + roll).toString();
        existingRow[2] = (Number(existingRow[2]) + totalYard).toString();
        existingRow[3] = (Number(existingRow[3]) + costPerYard).toString();
        existingRow[4] = (Number(existingRow[4]) + subTotal).toString();
      } else {
        mergedMap.set(productCode, [...row]);
      }
    });

    const finalSelectedRows = Array.from(
      mergedMap.values().map((row) => [...row])
    );
    console.log("Final Selected Rows:", finalSelectedRows);

    setSelectedDetails((prevSelected) => {
      if (
        finalSelectedRows.every((row) => row[1] === "0" && row[2] === "0.00")
      ) {
        return [];
      }

      const newSelectedRows = [...prevSelected];
      finalSelectedRows.forEach((row) => {
        const index = newSelectedRows.findIndex((r) => r[0] === row[0]);
        if (index !== -1) {
          if (row[1] === "0" && row[2] === "0.00") {
            newSelectedRows.splice(index, 1);
          } else {
            newSelectedRows[index] = row;
          }
        } else {
          if (row[1] !== "0" || row[2] !== "0.00") {
            newSelectedRows.push(row);
          }
        }
      });
      return newSelectedRows.filter((row) => {
        const productCode = row[0];
        const finalRow = finalSelectedRows.find((r) => r[0] === productCode);
        return (
          (finalRow && (finalRow[1] !== "0" || finalRow[2] !== "0.00")) ||
          prevSelected.includes(row)
        );
      });
    });
  };

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
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batch_no: "",
      status: "New",
      start_date: "",
      end_date: "",
      remarks: "",
    },
  });

  const fieldsValues = watch();

  const remarksValue = watch("remarks");
  console.log("Current remarks:", remarksValue);

  const handleNextTab = () => {
    setActiveTab(activeTab + 1);
  };

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
      type: "text",
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
    return data?.map((item) =>
      item?.details?.map((detail) => [
        detail?.product_code || "-",
        detail?.roll,
        detail?.total_yard,
        formatRupiah(detail?.cost_per_yard?.toString() || "-"),
        formatRupiah(detail?.sub_total?.toString() || "-"),
        detail?.inventory_bahan_baku_to_cutters?.status,
        detail?.remarks,
      ])
    );
  };

  useEffect(() => {
    if (!orderToCutters?.length) return;

    const detailsTable = formatDetailsData(orderToCutters);
    setDetailsTable(detailsTable as string[][][]);
  }, [orderToCutters]);

  const steps = [
    { id: 1, label: "Main Info" },
    { id: 2, label: "Select Items" },
    { id: 3, label: "Summary" },
  ];

  const formatSelectedDetails = () => {
    return selectedDetails.map((item) => ({
      product_code: item[0], // Gantilah dengan ID yang sesuai dari database jika ada
      reference_type: "cutters", // Sesuaikan dengan jenis yang sesuai
      quantity: Number(item[1]),
      total_yard: Number(item[2]),
      cost_per_yard: parseFloat(item[3].replace("Rp", "").replace(/\D/g, "")), // Hapus semua non-angka, kecuali angka
      sub_total: parseFloat(item[4].replace("Rp", "").replace(/\D/g, "")), // Sama seperti di atas
      remarks: item[6],
      is_active: true,
    }));
  };

  const handleSubmitBatch = async () => {
    try {
      const payload = {
        batch_number: fieldsValues.batch_no,
        start_date: fieldsValues.start_date,
        end_date: fieldsValues.end_date,
        status: "On Progress",
        remarks: fieldsValues.remarks || "-",
        is_active: true,
        details: formatSelectedDetails(),
      };

      await BatchService.create(payload);
      window.location.href = "/batch-to-cutters";
    } catch (err) {
      console.error("Error fetching data:", err);
      setOrderToCutters([]);
    }
  };

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
                      field.name === "remarks" && "col-span-2"
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
                  type="button"
                  onClick={handleNextTab}
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
                  onSelectionChange={handleSelectionChange}
                />
              </div>
            </div>
            <div className="border bg-white rounded-lg p-6 col-span-2 h-fit">
              <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
              <div className="text-sm my-4 grid space-y-2">
                {selectedDetails?.map((item, index) => (
                  <div key={index}>
                    <p className="text-xs text-gray-500">{item[1]} rolls</p>
                    <p>{item[0]}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleNextTab}
                className="mt-2 w-full px-4 py-2 bg-slate-900 text-white text-sm rounded shadow hover:opacity-50 transition ease-in-out duration-300"
              >
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
                    <p>{fieldsValues.batch_no}</p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Status:
                      </span>
                    </p>
                    <p>New</p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Start Date:
                      </span>
                    </p>
                    <p>{fieldsValues.start_date}</p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold text-gray-800">
                        End Date:
                      </span>
                    </p>
                    <p>{fieldsValues.end_date}</p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Remarks
                      </span>
                    </p>
                    <p>{fieldsValues.remarks} </p>
                  </div>
                </div>
                <div className="p-6">
                  <section className="flex-1 overflow-auto w-full">
                    <div className="bg-neutral-200 border border-gray-200 rounded-lg w-full relative">
                      <Cores.Table
                        data={selectedDetails.map((item) => ({
                          "Product Code": item[0],
                          "Total Qty": item[1],
                        }))}
                        headers={["Product Code", "Total Qty"]}
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 mb-4">
              <button
                type="submit"
                onClick={handleSubmitBatch}
                className="bg-slate-900 text-white hover:opacity-50 transition duration-300 px-3 py-1.5 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </section>
    </Layouts.Main>
  );
};

export default CreateBatchToCuttersPage;
