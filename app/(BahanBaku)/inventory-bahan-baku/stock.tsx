"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { Path, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { BahanBaku } from "@/types/bahanBaku";
import { BahanBakuService } from "@/services/bahanBaku.service";
import { Supplier } from "@/types/suppliers";
import { SuppliersService } from "@/services/suppliers.service";

const formSchema = z.object({
  invoice_date: z.string().min(1, { message: "Invoice Date is required" }),
  invoice_no: z.string().min(1, { message: "Invoice No is required" }),
  supplier: z.string().min(1, { message: "Supplier is required" }),
  total_roll: z.number().min(1, { message: "Total Roll is required" }),
  total_yards: z.number().min(1, { message: "Total Yard is required" }),
  cost_per_yard: z.number().min(1, { message: "Cost per Yard is required" }),
  sub_total: z.number().min(1, { message: "Subtotal is required" }),
  bahan_baku: z.string().min(1, { message: "Bahan Baku is required" }),
  length_yard: z.number().min(1, { message: "Length Yard is required" }),
  remarks: z.string(),
});

const Stock = ({ onClose }: { onClose: () => void }) => {
  const [data, setData] = useState<BahanBaku[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [detail, setDetail] = useState<string[][]>([]);
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_date: "",
      invoice_no: "",
      supplier: "",
      cost_per_yard: 0,
      sub_total: 0,
      total_roll: 0,
      total_yards: 0,
      bahan_baku: "",
      length_yard: 0,
      remarks: "",
    },
  });

  const headers = [
    "Total Roll",
    "Bahan",
    "Total Yard",
    "Price (/yard)",
    "Subtotal",
    "Remarks",
  ];

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const bahanBakuRes = await BahanBakuService.getAll();
        setData(bahanBakuRes.data.data);
      } catch (err) {
        console.error("Error fetching Bahan Baku:", err);
        setData([]); // Tetap set state kosong agar tidak error di render
      }

      try {
        const suppliersRes = await SuppliersService.getAll();
        setSuppliers(suppliersRes.data.data);
      } catch (err) {
        console.error("Error fetching Suppliers:", err);
        setSuppliers([]); // Tetap set state kosong agar tidak error di render
      }
    };

    fetchAllData();
  }, []);

  const fields = [
    {
      label: "Invoice Date",
      name: "invoice_date",
      type: "date",
      placeholder: "Invoice Date",
      required: true,
    },
    {
      label: "Invoice No.",
      name: "invoice_no",
      type: "text",
      placeholder: "Invoice No",
      required: true,
    },
    {
      label: "Supplier",
      name: "supplier",
      type: "select",
      placeholder: "Supplier",
      required: true,
      options: suppliers.map((item) => ({
        label: item?.name,
        value: item?.id?.toString(),
      })),
    },
    {
      label: "Bahan Baku",
      name: "bahan_baku",
      type: "select",
      placeholder: "Bahan Baku",
      required: true,
      options: data.map((item) => ({
        label:
          item?.code?.code + " - " + item?.color?.color + " - " + item?.item,
        value: item.id.toString(),
      })),
    },
    {
      label: "Total Yards",
      name: "total_yards",
      type: "number",
      required: true,
      readOnly: true,
    },
    {
      label: "Price/Yard",
      name: "cost_per_yard",
      type: "number",
      required: true,
    },
    {
      label: "Sub Total",
      name: "sub_total",
      type: "number",
      required: true,
      readOnly: true,
    },
    {
      label: "Remarks",
      name: "remarks",
      type: "text",
      placeholder: "Remarks",
      required: true,
    },
    {
      label: "Total Roll",
      name: "total_roll",
      type: "number",
      required: true,
    },
    {
      label: "Length Yard",
      name: "length_yard",
      type: "number",
      required: true,
    },
  ];

  const handleCalculate = () => {
    const totalRoll = Number(getValues("total_roll")) || 0;
    const lengthYard = Number(getValues("length_yard")) || 0;
    const costPerYard = Number(getValues("cost_per_yard")) || 0;

    const totalYards = totalRoll * lengthYard;
    const subTotal = costPerYard * totalYards;

    setValue("total_yards", totalYards);
    setValue("sub_total", subTotal);
  };

  const formatRupiah = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const handleAddItem = () => {
    const formData = getValues();
    const bahanBaku = data.find(
      (item) => item.id === Number(formData.bahan_baku)
    );
    const newRow: string[] = [
      formData.total_roll.toString() || "0",
      bahanBaku?.code?.code +
        " - " +
        bahanBaku?.color?.color +
        " - " +
        bahanBaku?.item,
      formData.total_yards.toString(),
      formatRupiah(formData.cost_per_yard),
      formatRupiah(formData.sub_total),
      formData.remarks || "-",
    ];

    setRows([...rows, newRow]);
    setDetail([
      [formData.total_roll.toString()],
      [formData.total_yards.toString()],
    ]);

    console.log(formData);

    // reset();
  };

  return (
    <Cores.Modal
      title="Stock"
      onClose={onClose}
      maxHeight="max-h-[92vh]"
      maxWidth="max-w-[96vw]"
    >
      <Layouts.Form>
        <div className="space-y-5">
          <div className="grid grid-cols-6 gap-4">
            {fields.slice(0, 3).map((field) => (
              <div key={field.name}>
                <Fragments.ControllerInput
                  {...field}
                  name={field.name as Path<z.infer<typeof formSchema>>}
                  control={control}
                  errors={errors}
                  readonly={field.readOnly}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Item
              </label>
              <div className="relative border rounded bg-gray-100">
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-8 gap-2">
                    {fields.slice(3, 4).map((field) => (
                      <div key={field.name} className={`col-span-12`}>
                        <Fragments.ControllerInput
                          {...field}
                          name={field.name as Path<z.infer<typeof formSchema>>}
                          control={control}
                          errors={errors}
                          readonly={field.readOnly}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {fields.slice(4, 7).map((field) => (
                      <div
                        key={field.name}
                        className={`${
                          field.name === "total_yards"
                            ? "col-span-2"
                            : "col-span-3"
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
                  </div>
                  <div className="w-full">
                    {fields.slice(7, 8).map((field) => (
                      <div key={field.name}>
                        <Fragments.ControllerInput
                          {...field}
                          name={field.name as Path<z.infer<typeof formSchema>>}
                          control={control}
                          errors={errors}
                          readonly={field.readOnly}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <hr />
                <div className="w-full px-4">
                  <div className="grid grid-cols-12 gap-2">
                    {fields.slice(8, 10).map((field) => (
                      <div
                        key={field.name}
                        className="col-span-6 flex flex-col gap-2"
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
                      onClick={handleCalculate}
                      className="col-span-12 bg-green-500 rounded px-4 py-2 text-white mb-4"
                    >
                      Calculate
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t bg-gray-300 w-full flex items-center justify-center py-3">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-gray-600 text-white hover:opacity-50 transition duration-300 px-3 py-1.5 rounded"
                >
                  Add Item
                </button>
              </div>
            </div>
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items
              </label>
              {rows.length > 0 ? (
                <div className="overflow-auto border border-gray-200 rounded">
                  <Cores.StockTable
                    headers={headers}
                    rows={rows}
                    detail={detail}
                  />
                </div>
              ) : (
                <p className="text-gray-600 text-xs italic">No Items</p>
              )}
            </div>
          </div>
        </div>
      </Layouts.Form>
    </Cores.Modal>
  );
};

export default Stock;
