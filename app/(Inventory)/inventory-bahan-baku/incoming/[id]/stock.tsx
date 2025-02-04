"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { Path, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { BahanBaku } from "@/types/bahanBaku";
import { BahanBakuService } from "@/services/bahanBaku.service";
import { Supplier } from "@/types/suppliers";
import { SuppliersService } from "@/services/suppliers.service";
import { IncomingBahanBakuService } from "@/services/incomingBahanBaku.service";

const formSchema = z.object({
  invoice_date: z.string(),
  invoice_no: z.string(),
  supplier: z.string(),
  total_roll: z.number(),
  total_yards: z.number(),
  cost_per_yard: z.number(),
  sub_total: z.number(),
  bahan_baku: z.string(),
  length_yard: z.number(),
  remarks: z.string(),
});

const Stock = ({ onClose }: { onClose: () => void }) => {
  const [data, setData] = useState<BahanBaku[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [detail, setDetail] = useState<string[][][]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [bahanBakuIds, setBahanBakuIds] = useState<string[]>([]);

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
        value: item?.id?.toString() ?? "",
      })),
    },
    {
      label: "Bahan Baku",
      name: "bahan_baku",
      type: "select",
      placeholder: "Bahan Baku",
      required: true,
      options: data.map((item) => ({
        label: `${item.code.code} - ${item.color.color} - ${item.item}`,
        value: item.id.toString() ?? "",
      })),
    },
    {
      label: "Total Yards",
      name: "total_yards",
      type: "number",
      placeholder: "Total Yards",
      required: true,
      readOnly: true,
    },
    {
      label: "Price/Yard",
      name: "cost_per_yard",
      type: "number",
      placeholder: "Price/Yard",
      required: true,
    },
    {
      label: "Sub Total",
      name: "sub_total",
      type: "number",
      placeholder: "Sub Total",
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
      placeholder: "Total Roll",
      required: true,
    },
    {
      label: "Length Yard",
      name: "length_yard",
      type: "number",
      placeholder: "Length Yard",
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
      formData.total_roll.toString(),
      `${bahanBaku?.code?.code} - ${bahanBaku?.color?.color} - ${bahanBaku?.item}`, // Nama bahan
      formData.total_yards.toString(),
      formatRupiah(formData.cost_per_yard),
      formatRupiah(formData.sub_total),
      formData.remarks || "-",
    ];

    setRows([...rows, newRow]);
    setBahanBakuIds([...bahanBakuIds, formData.bahan_baku]);
    setDetail((prevDetails) => [
      ...prevDetails,
      [[formData.total_roll.toString(), formData.length_yard.toString()]],
    ]);

    reset(
      {
        total_roll: 0,
        total_yards: 0,
        cost_per_yard: 0,
        sub_total: 0,
        remarks: "-",
        bahan_baku: getValues("bahan_baku"),
        length_yard: 0,
        invoice_date: getValues("invoice_date"),
        invoice_no: getValues("invoice_no"),
        supplier: getValues("supplier"),
      },
      { keepDefaultValues: true }
    );
  };

  const handleEditItem = (rowIndex: number) => {
    setSelectedRow(rowIndex);
  };

  useEffect(() => {
    if (selectedRow !== null) {
      const row = rows[selectedRow];
      const bahanBakuId = bahanBakuIds[selectedRow];

      const totalRoll = Number(row[0]) || 0;
      const totalYards = Number(row[2]) || 0;

      setValue("bahan_baku", bahanBakuId); // Simpan ID bahan baku
      setValue("total_roll", Number(row[0]) || 0);
      setValue("total_yards", Number(row[2]) || 0);

      // Hapus "Rp" dan titik pemisah ribuan sebelum menyimpan ke form
      setValue("cost_per_yard", Number(row[3].replace(/[^\d]/g, "")) || 0);
      setValue("sub_total", Number(row[4].replace(/[^\d]/g, "")) || 0);

      setValue("remarks", row[5] || "");

      const lengthYard = totalRoll > 0 ? totalYards / totalRoll : 0;

      setValue("length_yard", lengthYard);
    }
  }, [selectedRow, rows, setValue, bahanBakuIds]);

  const handleDeleteItem = (rowIndex: number) => {
    setRows((prevRows) => prevRows.filter((_, index) => index !== rowIndex));
    setBahanBakuIds((prevIds) =>
      prevIds.filter((_, index) => index !== rowIndex)
    );
    setDetail((prevDetails) =>
      prevDetails.filter((_, index) => index !== rowIndex)
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const totalRoll = Number(data.total_roll) || 0;
      const payload = {
        invoice_date: data.invoice_date, // sudah sesuai
        invoice_number: data.invoice_no, // ganti menjadi invoice_number, sesuai validator
        id_supplier: Number(data.supplier), // ganti id_supplier dengan data.supplier, pastikan sudah number
        details: rows.map((row, index) => ({
          id_bahan_baku: Number(bahanBakuIds[index]), // Pastikan id_bahan_baku sudah number dan valid
          length_yard:
            Number(row[1]) && totalRoll > 0 ? Number(row[1]) / totalRoll : 0,
          roll: Number(row[0]), // Pastikan roll adalah angka dan lebih dari 0
          total_yard: Number(row[2]), // Pastikan sudah number
          cost_per_yard: Number(row[3].replace(/[^\d]/g, "")), // Hilangkan format Rupiah dan pastikan menjadi angka
          sub_total: Number(row[4].replace(/[^\d]/g, "")), // Hilangkan format Rupiah dan pastikan menjadi angka
          remarks: row[5] || null, // Jika tidak ada remarks, kirimkan null (nullable)
        })),
      };

      await IncomingBahanBakuService.create(payload);

      window.location.href = `/inventory-bahan-baku/incoming`;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Cores.Modal
      title="Stock"
      onClose={onClose}
      maxHeight="max-h-[92vh]"
      maxWidth="max-w-[96vw]"
    >
      <Layouts.Form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <div className="grid grid-cols-6 gap-4">
            {fields.slice(0, 3).map((field) => (
              <div key={field.name}>
                <Fragments.ControllerInput
                  {...field}
                  name={field.name as Path<z.infer<typeof formSchema>>}
                  control={control}
                  errors={errors}
                  placeholder={field.placeholder}
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
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                </div>
              ) : (
                <p className="text-gray-600 text-xs italic">No Items</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 text-white hover:opacity-50 transition duration-300 px-3 py-1.5 rounded"
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white hover:opacity-50 transition duration-300 px-3 py-1.5 rounded"
          >
            Save
          </button>
        </div>
      </Layouts.Form>
    </Cores.Modal>
  );
};

export default Stock;
