"use client";

import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { Worker } from "@/types/workers";
import { WorkerService } from "@/services/workers.service";
import { Cores } from "@/components/core";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  min_cost: z.string().min(1, { message: "Minimum Cost is required" }),
  contact: z.string().min(1, { message: "Contact Number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

const CuttersPage = () => {
  const [data, setData] = useState<Worker[]>([]);
  const [detailsTable, setDetailsTable] = useState<string[][][]>([]);
  const [selectedData, setSelectedData] = useState<Worker | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Name",
      },
      {
        name: "min_cost",
        label: "Minimum Cost",
        type: "number",
        placeholder: "Minimum Cost",
      },
      {
        name: "contact",
        label: "Contact Number",
        type: "number",
        placeholder: "Contact Number",
      },
      {
        name: "address",
        label: "Address",
        type: "text",
        placeholder: "Address",
      },
    ],
    []
  );

  const {
    control,
    handleSubmit,
    // setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: {
      name: "",
      min_cost: "0",
      contact: "0",
      address: "",
    },
  });
  const headers = useMemo(
    () => ["Name", "Minimum Cost", "Contact Number", "Address"],
    []
  );

  const formatRupiah = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await WorkerService.getAll({ type: "cutters" });
        if (!response.data.data) {
          setData([]);
        }
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data?.length) return;

    const detailsTable = formatDataNew(data);
    setDetailsTable(detailsTable as string[][][]);
    console.log(detailsTable);
  }, [data]);

  const formatData = (data: Worker[]) => {
    return data.map((item) => ({
      Name: item.name || "-",
      "Minimum Cost": formatRupiah(
        Number(
          item.worker_types
            ?.filter((type) => type.worker_type?.toLowerCase() === "cutters")
            .map((type) => type.min_cost)
            .join(", ") || 0
        )
      ),
      "Contact Number": item.contact || "-",
      Address: item.address || "-",
    }));
  };

  const formatDataNew = (data: Worker[]) => {
    return data.map((worker) =>
      worker?.prices?.map((price) => [
        price.material_category || "-",
        formatRupiah(Number(price.cost_per_yard) || 0),
      ])
    );
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
    setSelectedData(null);
  };

  const handleSubmitForm: SubmitHandler<Worker> = async (formData) => {
    try {
      if (selectedData) {
        const response = await WorkerService.update(selectedData.id as number, {
          ...formData,
          is_active: true,
          type: "Cutters",
        });

        setData((prevData) =>
          prevData.map((item) =>
            item.id === selectedData.id ? response.data.data : item
          )
        );
      } else {
        const response = await WorkerService.create({
          ...formData,
          is_active: true,
          type: "Cutters",
        });

        setData((prevData) => [...prevData, response.data.data]);
      }

      setIsOpen(false);
      setSelectedData(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // const handleEdit = (item: Record<string, string | number | boolean>) => {
  //   const convertedData: Worker = {
  //     id: Number(item.id),
  //     name: item["Name"] as string,
  //     min_cost: item["Minimum Cost"] as string,
  //     contact: item["Contact Number"] as string,
  //     is_active: true,
  //     type: "cutters",
  //   };

  //   setSelectedData(convertedData);
  //   setIsOpen(true);
  // };

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="Cutters" onAdd={handleModal} />
      {isOpen && (
        <Cores.Modal title="Cost Based on Materials" onClose={handleModal}>
          <Layouts.Form onSubmit={handleSubmit(handleSubmitForm)}>
            {fields.map((field) => (
              <div key={field.name} className="mb-4">
                <Fragments.ControllerInput
                  {...field}
                  name={field.name as Path<z.infer<typeof formSchema>>}
                  control={control}
                  errors={errors}
                  defaultValue={
                    selectedData?.[field.name as keyof Worker]?.toString() || ""
                  }
                />
              </div>
            ))}
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={handleModal}
                type="button"
                className="bg-gray-200 text-sm px-6 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white text-sm px-6 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </Layouts.Form>
        </Cores.Modal>
      )}
      <section className="flex-1 p-4">
        <div className="bg-white border boder-gray-200 rounded-lg w-full relative">
          <div className="w-fit min-w-full sm:flex sm:justify-center">
            <Cores.Table
              details={true}
              detailsTitle="Cost Based on Materials"
              detailsRows={detailsTable}
              detailsHeaders={["Material Category", "Cost Per Yard"]}
              headers={headers}
              data={formatData(data)}
            />
          </div>
        </div>
      </section>
    </Layouts.Main>
  );
};

export default CuttersPage;
