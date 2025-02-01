"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { Path, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  invoice_date: z.string().min(1, { message: "Invoice Date is required" }),
  invoice_no: z.string().min(1, { message: "Invoice No is required" }),
  supplier: z.string().min(1, { message: "Supplier is required" }),
  total_roll: z.string().min(1, { message: "Total Roll is required" }),
  bahan_baku: z.string().min(1, { message: "Bahan Baku is required" }),
});

const Stock = ({ onClose }: { onClose: () => void }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
  });

  const headers = [
    "Total Roll",
    "Bahan",
    "Total Yard",
    "Price (/yard)",
    "Subtotal",
    "Remarks",
    "Actions",
  ];
  const rows = [
    [
      "2",
      "ALT^ Black",
      "600",
      "Rp 3.000",
      "Rp 1.800.000",
      "tes",
      "action buttons here",
    ],
    // Tambah baris lainnya sesuai kebutuhan
  ];

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
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
      options: [
        { label: "Supplier 1", value: "supplier_1" },
        { label: "Supplier 2", value: "supplier_2" },
      ],
    },
    {
      label: "Total Roll",
      name: "total_roll",
      type: "number",
      disable: true,
      required: true,
    },
    {
      label: "Bahan Baku",
      name: "bahan_baku",
      type: "select",
      placeholder: "Bahan Baku",
      required: true,
      options: [
        { label: "Bahan Baku 1", value: "bahan_baku_1" },
        { label: "Bahan Baku 2", value: "bahan_baku_2" },
      ],
    },
    {
      label: "Total Yards",
      name: "total_yards",
      type: "number",
      required: true,
      disable: true,
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
      disable: true,
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
  return (
    <Cores.Modal
      title="Stock"
      onClose={onClose}
      maxHeight="[96%]"
      maxWidth="[96vw]"
      className="mx-20"
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
                  disabled={field.disable}
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
                    {fields.slice(3, 5).map((field) => (
                      <div
                        key={field.name}
                        className={`${
                          field.name !== "bahan_baku"
                            ? "col-span-2"
                            : "col-span-6"
                        }`}
                      >
                        <Fragments.ControllerInput
                          {...field}
                          name={field.name as Path<z.infer<typeof formSchema>>}
                          control={control}
                          errors={errors}
                          disabled={field.disable}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {fields.slice(5, 8).map((field) => (
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
                          disabled={field.disable}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="w-full">
                    {fields.slice(8, 9).map((field) => (
                      <div key={field.name}>
                        <Fragments.ControllerInput
                          {...field}
                          name={field.name as Path<z.infer<typeof formSchema>>}
                          control={control}
                          errors={errors}
                          disabled={field.disable}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <hr />
                <div className="w-full px-4">
                  <div className="grid grid-cols-12 gap-2">
                    {fields.slice(9, 11).map((field) => (
                      <div
                        key={field.name}
                        className="col-span-6 flex flex-col gap-2"
                      >
                        <Fragments.ControllerInput
                          {...field}
                          name={field.name as Path<z.infer<typeof formSchema>>}
                          control={control}
                          errors={errors}
                          disabled={field.disable}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="col-span-12 bg-green-500 rounded px-4 py-2 text-white mb-4"
                    >
                      Calculate
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t bg-gray-300 w-full flex items-center justify-center py-3">
                <button className="bg-gray-600 text-white hover:opacity-50 transition duration-300 px-3 py-1.5 rounded">
                  Add Item
                </button>
              </div>
            </div>
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items
              </label>
              <p className="text-gray-600 text-xs italic">No Items</p>
              <div className="overflow-auto border border-gray-200 rounded">
                <Cores.StockTable headers={headers} rows={rows} />
              </div>
            </div>
          </div>
        </div>
      </Layouts.Form>
    </Cores.Modal>
  );
};

export default Stock;
