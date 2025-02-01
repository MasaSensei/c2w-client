"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { BahanBaku } from "@/types/bahanBaku";
import { BahanBakuService } from "@/services/bahanBaku.service";

const formSchema = z.object({
  code: z.string().min(1, { message: "Code is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  total_roll: z.string().min(1, { message: "Total Roll is required" }),
  total_yard: z.string().min(1, { message: "Total Yard is required" }),
  cost_per_yard: z.string().min(1, { message: "Cost per Yard is required" }),
  remarks: z.string(),
});

const InventoryBahanBaku = () => {
  const [data, setData] = useState<BahanBaku[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<BahanBaku | null>(null);
  const headers = [
    "Code",
    "Color",
    "Category",
    "Total Roll",
    "Total Yard",
    "Cost per Yard",
    "Remarks",
  ];

  useEffect(() => {
    BahanBakuService.getAll()
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error("Error fetching bahan baku:", err));
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: {
      code: "",
      color: "",
      category: "",
      total_roll: "",
      total_yard: "",
      cost_per_yard: "",
      remarks: "",
    },
  });

  const fields = useMemo(
    () => [
      {
        name: "code",
        label: "Code",
        type: "text",
        placeholder: "Code",
        required: true,
      },
      {
        name: "color",
        label: "Color",
        type: "text",
        placeholder: "color",
        required: true,
      },
      {
        name: "category",
        label: "Category",
        type: "text",
        placeholder: "Category",
        required: true,
      },
      {
        name: "remarks",
        label: "Remarks",
        type: "text",
        placeholder: "Remarks",
      },
    ],
    []
  );

  const formatRupiah = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const formatData = (data: BahanBaku[]) => {
    return data.map((item) => ({
      Code: item?.code?.code || "-",
      Color: item.color.color || "-",
      Category: item.category.map((cat) => cat.category).join(", ") || "-",
      "Total Roll": item.total_roll || 0,
      "Total Yard": item.total_yard || 0,
      "Cost per Yard": formatRupiah(item.cost_per_yard || 0),
      Remarks: item.remarks || "-",
    }));
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
    setSelectedData(null);
  };

  const handleSubmitForm: SubmitHandler<BahanBaku> = async (formData) => {
    console.log(formData);
  };

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions
        title="Inventory Bahan Baku"
        onFilter={() => {}}
        onAdd={handleModal}
      />
      {isOpen && (
        <Cores.Modal title="Tambah Bahan Baku" onClose={handleModal}>
          <Layouts.Form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {fields
                  .filter(
                    (field) => field.name === "code" || field.name === "color"
                  )
                  .map((field) => (
                    <div key={field.name}>
                      <Fragments.ControllerInput
                        {...field}
                        name={field.name as Path<z.infer<typeof formSchema>>}
                        control={control}
                        errors={errors}
                      />
                    </div>
                  ))}
              </div>

              {fields.some((field) => field.name === "category") && (
                <div className="pb-4 col-span-1">
                  <Fragments.ControllerInput
                    name="category"
                    label="Categories"
                    type="category"
                    placeholder="Add Category"
                    control={control}
                    errors={errors}
                  />
                </div>
              )}

              {fields
                .filter((field) => field.name === "remarks")
                .map((field) => (
                  <div key={field.name} className="mb-4">
                    <Fragments.ControllerInput
                      {...field}
                      name={field.name as Path<z.infer<typeof formSchema>>}
                      control={control}
                      errors={errors}
                      defaultValue={selectedData?.remarks}
                    />
                  </div>
                ))}
            </div>
          </Layouts.Form>
        </Cores.Modal>
      )}

      <section className="flex-1 p-4">
        <div className="bg-white border boder-gray-200 rounded-lg w-full relative">
          <div className="w-fit min-w-full sm:flex sm:justify-center">
            {/* {loading && <ClipLoader color="black" />} */}
            <Cores.Table
              onEdit={() => {}}
              headers={headers}
              data={formatData(data)}
              onDelete={() => {}}
            />
          </div>
        </div>
      </section>
    </Layouts.Main>
  );
};

export default InventoryBahanBaku;
