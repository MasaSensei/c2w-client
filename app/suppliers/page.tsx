"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Path, FieldValues } from "react-hook-form"; // import useForm
import { Supplier } from "@/types/suppliers";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Field<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: "text" | "number";
  placeholder: string;
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
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: {
      name: "",
      contact: "",
      address: "",
      remarks: "",
    },
  });

  const fields: Field<z.infer<typeof formSchema>>[] = [
    { name: "name", label: "Name", type: "text", placeholder: "Name" },
    {
      name: "contact",
      label: "Contact Number",
      type: "number",
      placeholder: "Contact Number",
    },
    { name: "address", label: "Address", type: "text", placeholder: "Address" },
    { name: "remarks", label: "Remarks", type: "text", placeholder: "Remarks" },
  ];

  const formatData = (data: Supplier[]) => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      return headers.reduce((acc, header) => {
        if (header === "Id") {
          acc[header] = item.id ? String(item.id) : "-";
        }
        if (header === "Name") {
          acc[header] = item.name ? String(item.name) : "-";
        } else if (header === "Contact Number") {
          acc[header] = item.contact ? String(item.contact) : "-";
        } else if (header === "Address") {
          acc[header] = item.address ? String(item.address) : "-";
        } else if (header === "Remarks") {
          acc[header] = item.remarks ? String(item.remarks) : "-";
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

  const handleSubmitForm: SubmitHandler<Supplier> = async (formData) => {
    try {
      if (selectedData) {
        // Mode Edit (Gunakan PUT)
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/suppliers/${selectedData["id"]}`,
          {
            ...formData,
            is_active: 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Perbarui data di state tanpa menambah baru
        setdata((prevData) =>
          prevData.map((item) =>
            item.id === selectedData.id ? response.data.data : item
          )
        );
      } else {
        // Mode Tambah (Gunakan POST)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/suppliers`,
          {
            ...formData,
            is_active: 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Tambahkan data baru ke state
        setdata((prevData) => [...prevData, response.data.data]);
      }

      // Tutup modal dan reset selectedData
      setIsOpen(false);
      setSelectedData(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (item: Record<string, string | number | boolean>) => {
    const convertedData: Supplier = {
      id: item.id as number,
      name: item["Name"] as string,
      contact: item["Contact Number"] as string,
      address: item["Address"] as string,
      remarks: item["Remarks"] as string,
      is_active: 1,
    };

    console.log("Editing supplier data:", convertedData); // Log data yang dipilih
    setSelectedData(convertedData);
    setIsOpen(true);
  };

  useEffect(() => {
    if (selectedData) {
      console.log("Selected data to populate form:", selectedData); // Log data yang akan di-set
      fields.forEach((field) => {
        setValue(
          field.name as Path<z.infer<typeof formSchema>>,
          (selectedData[field.name as keyof Supplier] ?? "") as string // Pastikan selalu string
        );
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
          <Layouts.Form onSubmit={handleSubmit(handleSubmitForm)}>
            {fields.map((field) => (
              <div key={field.name} className="mb-4">
                <Fragments.ControllerInput
                  {...field}
                  name={field.name as Path<z.infer<typeof formSchema>>}
                  control={control}
                  errors={errors}
                  defaultValue={
                    selectedData?.[field.name as keyof Supplier]?.toString() ||
                    ""
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
