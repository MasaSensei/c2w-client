"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { Supplier } from "@/types/suppliers";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { SuppliersService } from "@/services/suppliers.service";
import { ClipLoader } from "react-spinners";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  contact: z.string().min(1, { message: "Contact Number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  remarks: z.string(),
});

const CodePage = () => {
  const [data, setdata] = useState<Supplier[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);
  const headers = ["Name", "Contact Number", "Address", "Remarks"];

  useEffect(() => {
    SuppliersService.getAll()
      .then((res) => {
        setdata(res.data.data);
      })
      .catch((err) => console.error("Error fetching suppliers:", err));
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

  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Name",
        required: true,
      },
      {
        name: "contact",
        label: "Contact Number",
        type: "number",
        placeholder: "Contact Number",
        required: true,
      },
      {
        name: "address",
        label: "Address",
        type: "text",
        placeholder: "Address",
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

  const formatData = (data: Supplier[]) => {
    return data.map((item) => ({
      Name: item.name || "-",
      "Contact Number": item.contact || "-",
      Address: item.address || "-",
      Remarks: item.remarks || "-",
      id: item.id?.toString() || "-",
    }));
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
    setSelectedData(null);
  };

  const handleSubmitForm: SubmitHandler<Supplier> = async (formData) => {
    try {
      if (selectedData) {
        const response = await SuppliersService.update(
          selectedData.id as number,
          {
            ...formData,
            is_active: 1,
          }
        );

        setdata((prevData) =>
          prevData.map((item) =>
            item.id === selectedData.id ? response.data.data : item
          )
        );
      } else {
        const response = await SuppliersService.create({
          ...formData,
          is_active: 1,
        });

        setdata((prevData) => [...prevData, response.data.data]);
      }

      setIsOpen(false);
      setSelectedData(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (item: Record<string, string | number | boolean>) => {
    const convertedData: Supplier = {
      id: Number(item.id),
      name: item["Name"] as string,
      contact: item["Contact Number"] as string,
      address: item["Address"] as string,
      remarks: item["Remarks"] as string,
      is_active: 1,
    };

    setSelectedData(convertedData);
    setIsOpen(true);
  };

  useEffect(() => {
    if (selectedData) {
      fields.forEach((field) => {
        setValue(
          field.name as Path<z.infer<typeof formSchema>>,
          (selectedData[field.name as keyof Supplier] ?? "") as string
        );
      });
    }
  }, [selectedData, setValue, fields]);

  const handleDelete = async (
    item: Record<string, string | number | boolean>
  ) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setLoading(true);

      try {
        await SuppliersService.delete(item.id as number);

        const res = await SuppliersService.getAll();
        setdata(res.data.data);

        Swal.fire("Terhapus!", "Data supplier berhasil dihapus.", "success");
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data", "error");
        console.error("Delete error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

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
            {loading && <ClipLoader color="black" />}
            <Cores.Table
              onEdit={handleEdit}
              headers={headers}
              data={formatData(data)}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default CodePage;
