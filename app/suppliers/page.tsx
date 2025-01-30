"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"; // import useForm
import { Supplier } from "@/types/suppliers";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Field {
  name: string;
  label: string;
  type: "text";
}

const formSchema = z.object({
  name: z.string(),
  contact: z.string(),
  address: z.string(),
  remarks: z.string(),
});

const SuppliersPage = () => {
  const [data, setdata] = useState<Supplier[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Supplier | null>(null);
  const headers = ["Name", "Contact Number", "Address", "Remarks"];

  useEffect(() => {
    const response = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`);
    response.then((res) => {
      setdata(res.data.data);
    });
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      address: "",
      remarks: "",
    },
  });

  const fields: Field[] = [
    { name: "name" as const, label: "Name", type: "text" },
    { name: "contact" as const, label: "Contact Number", type: "text" },
    { name: "address" as const, label: "Address", type: "text" },
    { name: "remarks" as const, label: "Remarks", type: "text" },
  ];

  const formatData = (data: Supplier[]) => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      return headers.reduce((acc, header) => {
        const keyMap: Record<string, keyof Supplier> = {
          Name: "name",
          "Contact Number": "contact",
          Address: "address",
          Remarks: "remarks",
        };

        if (keyMap[header]) {
          const value = item[keyMap[header]];
          acc[header] = value ? String(value) : "-";
        }

        return acc;
      }, {} as Record<string, string>);
    });
  };

  const formattedData = formatData(data);

  const handleModal = () => {
    setIsOpen(!isOpen);
    setSelectedData(null);
  };

  const handleSubmitForm: SubmitHandler<Supplier> = async (data) => {
    console.log("Received form data:", data);
    // Add your submit logic here, e.g. API call to save data
  };

  const handleEdit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    setIsOpen(true);
  };

  useEffect(() => {
    if (selectedData) {
      fields.forEach((field) => {
        setValue(field.name as any, selectedData[field.name as keyof Supplier]); // Set default value for selected data
      });
    }
  }, [selectedData, setValue]);

  return (
    <main className="h-full flex flex-col bg-neutral-300">
      <Fragments.HeaderWithActions
        title="Suppliers"
        onFilter={() => {}}
        onAdd={handleModal}
      />
      {isOpen && (
        <Cores.Modal
          onClose={handleModal}
          title={selectedData ? "Edit Supplier" : "Add Supplier"}
        >
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Layouts.Form
              fields={fields}
              register={register} // Pass register here
              errors={errors} // Pass errors here
              onClose={handleModal}
            />
          </form>
        </Cores.Modal>
      )}
      <section className="flex-1 p-4">
        <div className="bg-white border boder-gray-200 rounded-lg w-full relative">
          <div className="w-fit min-w-full sm:flex sm:justify-center">
            <Cores.Table
              onEdit={handleEdit}
              headers={headers}
              data={formattedData}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SuppliersPage;
