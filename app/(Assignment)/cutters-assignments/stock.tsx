"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { Path, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { OrderToCuttersService } from "@/services/orderToCutters.service";
import { WorkerService } from "@/services/workers.service";
import { Worker } from "@/types/workers";
import { BatchService } from "@/services/batch.service";
import { Batch } from "@/types/batch";

const formSchema = z.object({
  assign_date: z.string(),
  worker: z.string(),
  order_no: z.string(),
  remarks: z.string(),
  material: z.string(),
  price_per_yard: z.number(),
  total_roll: z.number(),
  total_yards: z.number(),
});

const AssignWorkerCuttersAssignment = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const [materials, setMaterials] = useState<Batch[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [materialIds, setMaterialIds] = useState<string[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BatchService.getAll({ type: "cutters" });
        if (!response.data.data) {
          setMaterials([]);
        }
        setMaterials(response.data.data);
        const workerResponse = await WorkerService.getAll({ type: "cutters" });
        if (!workerResponse.data.data) {
          setWorkers([]);
        }
        setWorkers(workerResponse.data.data);
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
      assign_date: "",
      worker: "",
      order_no: "",
      remarks: "",
      material: "",
      price_per_yard: 0,
      total_roll: 0,
      total_yards: 0,
    },
  });

  const fields = [
    {
      label: "Assign Date",
      name: "assign_date",
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
      label: "Cutters",
      name: "worker",
      type: "select",
      required: true,
      options: workers.map((worker) => ({
        value: worker.id?.toString() || "",
        label: worker.name || "-",
      })),
    },
    {
      label: "Remarks",
      name: "remarks",
      type: "text",
      required: true,
    },
    {
      label: "Batch Number",
      name: "material",
      type: "select",
      required: true,
      options: materials.map((material) => ({
        value: material?.id?.toString() || "",
        label: `${material?.batch_number}`,
      })),
    },
  ];

  const handleAddItem = () => {
    const formData = getValues();
    const batch = materials.find(
      (item) => item.id === Number(formData.material)
    );

    const newRow: string[] = [batch?.batch_number || "-"];

    setRows([...rows, newRow]);
    setMaterialIds([...materialIds, formData.material]);

    reset(
      {
        total_roll: 0,
        total_yards: 0,
        price_per_yard: 0,
        remarks: getValues("remarks"),
        material: getValues("material"),
        assign_date: getValues("assign_date"),
        order_no: getValues("order_no"),
        worker: getValues("worker"),
      },
      { keepDefaultValues: true }
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        invoice_number: data.order_no,
        assign_date: data.assign_date,
        worker: data.worker,
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
      title="Asign Cutters Assignment"
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
                    headers={["Batch ID"]}
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

export default AssignWorkerCuttersAssignment;
