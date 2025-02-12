"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { Code } from "@/types/codes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { CodesService } from "@/services/codes.service";

const formSchema = z.object({
  code: z.string().min(1, { message: "Code is required" }),
  remarks: z.string(),
});

const CodePage = () => {
  const [data, setdata] = useState<Code[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Code | null>(null);
  const headers = ["Kode", "Remarks"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CodesService.getAll();
        if (!response.data.data) {
          setdata([]);
        }
        setdata(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);

        setdata([]);
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
      code: "",
      remarks: "",
    },
  });

  const fields = useMemo(
    () => [
      {
        name: "code",
        label: "Kode",
        type: "text",
        placeholder: "Code",
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

  const formatData = (data: Code[]) => {
    return data.map((item) => ({
      Kode: item.code || "-",
      Remarks: item.remarks || "-",
      id: item.id?.toString() || "-",
    }));
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
    setSelectedData(null);
  };

  const handleSubmitForm: SubmitHandler<Code> = async (formData) => {
    try {
      if (selectedData) {
        const response = await CodesService.update(selectedData.id as number, {
          ...formData,
          code: formData.code.toUpperCase(),
          is_active: 1,
        });

        setdata((prevData) =>
          prevData.map((item) =>
            item.id === selectedData.id ? response.data.data : item
          )
        );
      } else {
        const response = await CodesService.create({
          ...formData,
          code: formData.code.toUpperCase(),
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
    const convertedData: Code = {
      id: Number(item.id),
      code: item["Kode"] as string,
      remarks: item["Remarks"] as string,
      is_active: 1,
    };

    setSelectedData(convertedData);
    setIsOpen(true);
  };

  useEffect(() => {
    if (selectedData) {
      fields.forEach((field) => {
        const newValue = (selectedData[field.name as keyof Code] ??
          "") as string;
        console.log(`Mengisi ${field.name} dengan:`, newValue);
        setValue(
          field.name as Path<z.infer<typeof formSchema>>,
          (selectedData[field.name as keyof Code] ?? "") as string
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
      try {
        await CodesService.delete(item.id as number);

        const res = await CodesService.getAll();
        setdata(res.data.data);

        Swal.fire("Terhapus!", "Data Code berhasil dihapus.", "success");
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data", "error");
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions
        title="Codes"
        onFilter={() => {}}
        onAdd={handleModal}
      />
      {isOpen && (
        <Cores.Modal
          onClose={handleModal}
          title={selectedData ? "Edit Code" : "Add Code"}
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
                    selectedData?.[field.name as keyof Code]?.toString() || ""
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
              data={formatData(data)}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </section>
    </Layouts.Main>
  );
};

export default CodePage;
