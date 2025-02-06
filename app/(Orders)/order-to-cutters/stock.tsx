"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { Path, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { InventoryBahanBakuToCutters } from "@/types/inventoryBahanBakuToCutters";
import { InventoryBahanBakuToCuttersService } from "@/services/inventoyBahanBakuToCutters.service";
import { OrderToCuttersService } from "@/services/orderToCutters.service";

const formSchema = z.object({
  order_date: z.string(),
  due_date: z.string(),
  order_no: z.string(),
  remarks: z.string(),
  material: z.string(),
  price_per_yard: z.number(),
  total_roll: z.number(),
  total_yards: z.number(),
});

const AddStock = ({ onClose }: { onClose: () => void }) => {
  const [materials, setMaterials] = useState<InventoryBahanBakuToCutters[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [materialIds, setMaterialIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await InventoryBahanBakuToCuttersService.getAll();
        if (!response.data.data) {
          setMaterials([]);
        }
        setMaterials(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_date: "",
      due_date: "",
      order_no: "",
      remarks: "",
      material: "",
      price_per_yard: 0,
      total_roll: 0,
      total_yards: 0,
    },
  });

  const selectedMaterialId = watch("material");

  const selectedMaterial = materials.find(
    (material) => material.id?.toString() === selectedMaterialId
  );

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatTotalYard = (value: number) => {
    const numberValue = Number(value) || 0; // Pastikan selalu angka
    return numberValue % 1 === 0
      ? numberValue.toFixed(0)
      : numberValue.toString();
  };

  const totalYards = formatTotalYard(selectedMaterial?.total_yard || 0);

  useEffect(() => {
    if (selectedMaterial) {
      setValue("total_roll", selectedMaterial.total_roll || 0);
      setValue("total_yards", selectedMaterial.total_yard || 0);
    }
  }, [selectedMaterial, setValue]);

  const fields = [
    {
      label: "Order Date",
      name: "order_date",
      type: "date",
      required: true,
    },
    {
      label: "Due Date",
      name: "due_date",
      type: "date",
      required: true,
    },
    {
      label: "Invoice No.",
      name: "order_no",
      type: "text",
      required: true,
    },
    {
      label: "Remarks",
      name: "remarks",
      type: "text",
      required: true,
    },
    {
      label: "Material",
      name: "material",
      type: "select",
      required: true,
      options: materials.map((material) => ({
        value: material?.id?.toString() || "",
        label: `${material?.model?.model} - ${material?.item} - ${
          material?.size?.size
        } (${material?.category?.map((cat) => cat.category).join(", ")})`,
      })),
    },
    {
      label: `Total Roll: ${selectedMaterial?.total_roll || 0}`,
      name: "total_roll",
      type: "number",
      required: true,
    },
    {
      label: `Total Yards: ${totalYards || 0}`,
      name: "total_yards",
      type: "number",
      required: true,
    },
    {
      label: "Price Per Yard",
      name: "price_per_yard",
      type: "number",
      required: true,
    },
  ];

  const handleAddItem = () => {
    const formData = getValues();
    const bahanBaku = materials.find(
      (item) => item.id === Number(formData.material)
    );

    const newRow: string[] = [
      formData.total_roll.toString(),
      `${bahanBaku?.model?.model} - ${
        bahanBaku?.item
      } (${bahanBaku?.category?.map((cat) => cat.category)})`,
      bahanBaku?.size?.size || "-",
      formData.total_yards.toString(),
      formatRupiah(formData.price_per_yard),
      formatRupiah(formData.total_yards * formData.price_per_yard),
      formData.remarks || "-",
    ];

    setRows([...rows, newRow]);
    setMaterialIds([...materialIds, formData.material]);

    reset(
      {
        total_roll: 0,
        total_yards: 0,
        price_per_yard: 0,
        remarks: getValues("remarks"),
        material: getValues("material"),
        order_date: getValues("order_date"),
        order_no: getValues("order_no"),
        due_date: getValues("due_date"),
      },
      { keepDefaultValues: true }
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        invoice_number: data.order_no,
        order_date: data.order_date,
        due_date: data.due_date,
        status: "new",
        is_active: true,
        remarks: data.remarks,
        details: rows.map((row, index) => ({
          product_code: `${row[1]} - ${row[2]}`,
          roll: Number(row[0]),
          total_yard: Number(row[3]),
          cost_per_yard: Number(row[4].replace(/[^\d]/g, "")),
          sub_total: Number(row[5].replace(/[^\d]/g, "")),
          remarks: row[6],
          id_inv_cutters_material: Number(materialIds[index]),
        })),
      };

      await OrderToCuttersService.create(payload);
      console.log(payload);

      //   window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Cores.Modal
      title="Add Order"
      onClose={onClose}
      maxHeight="max-h-[92vh]"
      maxWidth="max-w-[96vw]"
    >
      <Layouts.Form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <div className="grid grid-cols-6 gap-4">
            {fields.slice(0, 4).map((field) => (
              <div key={field.name}>
                <Fragments.ControllerInput
                  {...field}
                  name={field.name as Path<z.infer<typeof formSchema>>}
                  placeholder={field.label}
                  control={control}
                  errors={errors}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Order Form
              </label>
              <div className="relative border rounded bg-gray-100">
                <div className="p-4 space-y-4">
                  {fields.slice(4).map((field) => (
                    <div key={field.name}>
                      <Fragments.ControllerInput
                        {...field}
                        name={field.name as Path<z.infer<typeof formSchema>>}
                        placeholder={field.label}
                        control={control}
                        errors={errors}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Totals:{" "}
                      {watch("total_yards") * watch("price_per_yard")}
                    </label>
                  </div>
                </div>
                <div className="mt-2 border-t bg-gray-300 w-full flex items-center justify-center py-3">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-gray-600 text-white hover:opacity-50 transition duration-300 px-3 py-1.5 rounded"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items
              </label>
              {rows.length > 0 ? (
                <div className="overflow-auto border border-gray-200 rounded">
                  <Cores.StockTable
                    headers={[
                      "Roll",
                      "Material",
                      "Size",
                      "Yards",
                      "Price / yard",
                      "Sub Total",
                      "Remarks",
                    ]}
                    rows={rows}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onEditShow
                    onDeleteShow
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

export default AddStock;
