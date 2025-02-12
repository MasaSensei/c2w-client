"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { Category } from "@/types/category";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { CategoriesService } from "@/services/categories.service";
import { ClipLoader } from "react-spinners";

const formSchema = z.object({
  category: z.string().min(1, { message: "category is required" }),
  remarks: z.string(),
});

const ColorPage = () => {
  const [data, setdata] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const headers = ["Bahan Kategori", "Remarks"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await CategoriesService.getAll();
        if (!response.data.data) {
          setdata([]);
        }
        setdata(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
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
      category: "",
      remarks: "",
    },
  });

  const fields = useMemo(
    () => [
      {
        name: "category",
        label: "Bahan Kategori",
        type: "text",
        placeholder: "category",
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

  const formatData = (data: Category[]) => {
    return data.map((item) => ({
      "Bahan Kategori": item.category || "-",
      Remarks: item.remarks || "-",
      id: item.id?.toString() || "-",
    }));
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
    setSelectedData(null);
  };

  const handleSubmitForm: SubmitHandler<Category> = async (formData) => {
    try {
      if (selectedData) {
        const response = await CategoriesService.update(
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
        const response = await CategoriesService.create({
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
    const convertedData: Category = {
      id: Number(item.id),
      category: item["Bahan Kategori"] as string,
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
          (selectedData[field.name as keyof Category] ?? "") as string
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
        await CategoriesService.delete(item.id as number);

        const res = await CategoriesService.getAll();
        setdata(res.data.data);

        Swal.fire("Terhapus!", "Data color berhasil dihapus.", "success");
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data", "error");
        console.error("Delete error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions
        title="colors"
        onFilter={() => {}}
        onAdd={handleModal}
      />
      {isOpen && (
        <Cores.Modal
          onClose={handleModal}
          title={selectedData ? "Edit Bahan Kategori" : "Add Bahan Kategori"}
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
                    selectedData?.[field.name as keyof Category]?.toString() ||
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
    </Layouts.Main>
  );
};

export default ColorPage;
