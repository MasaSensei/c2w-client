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
import { Color } from "@/types/colors";
import { Code } from "@/types/codes";
import { ColorsService } from "@/services/colors.service";
import { CodesService } from "@/services/codes.service";
import Stock from "./stock";
import { OutgoingBahanBakuService } from "@/services/outgoingBahanBaku.service";

const formSchema = z.object({
  code: z.string().min(1, { message: "Code is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  item: z.string().min(1, { message: "Item is required" }),
  remarks: z.string(),
});

const transferSchema = z.object({
  input_date: z.string().min(1, { message: "Input Date is required" }),
  bahan_baku: z.string().min(1, { message: "Bahan Baku is required" }),
  id_bahan_baku: z.number().min(1, { message: "ID Bahan Baku is required" }),
  total_roll: z.string().min(1, { message: "Total Roll is required" }),
  total_yard: z.string().min(1, { message: "Total Yard is required" }),
  remarks: z.string(),
});

const InventoryBahanBaku = () => {
  const [data, setData] = useState<BahanBaku[]>([]);
  const [color, setColor] = useState<Color[]>([]);
  const [code, setCode] = useState<Code[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedTransferData, setSelectedTransferData] =
    useState<BahanBaku | null>(null);
  const [isStock, setIsStock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState<BahanBaku | null>(null);
  const headers = [
    "Code",
    "Color",
    "Item",
    "Total Roll",
    "Total Yard",
    "Cost per Yard",
    "Remarks",
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const bahanBakuRes = await BahanBakuService.getAll();
        setData(bahanBakuRes.data.data);
      } catch (err) {
        console.error("Error fetching Bahan Baku:", err);
        setData([]); // Tetap set state kosong agar tidak error di render
      }

      try {
        const colorsRes = await ColorsService.getAll();
        setColor(colorsRes.data.data);
      } catch (err) {
        console.error("Error fetching Colors:", err);
        setColor([]); // Tetap set state kosong agar tidak error di render
      }

      try {
        const codesRes = await CodesService.getAll();
        setCode(codesRes.data.data);
      } catch (err) {
        console.error("Error fetching Codes:", err);
        setCode([]); // Tetap set state kosong agar tidak error di render
      }
    };

    fetchAllData();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      color: "",
      item: "",
      remarks: "",
    },
  });

  const fields = useMemo(
    () => [
      {
        name: "code",
        label: "Code",
        type: "select",
        placeholder: "Pilih Code",
        options: code.map((c) => ({
          value: c?.id?.toString() || "",
          label: c.code,
        })),
      },
      {
        name: "color",
        label: "Color",
        type: "select",
        placeholder: "Pilih Color",
        options: color.map((c) => ({
          value: c?.id?.toString() || "",
          label: c.color,
        })),
      },
      {
        name: "item",
        label: "Item",
        type: "text",
        placeholder: "Masukkan Item",
      },
      {
        name: "remarks",
        label: "Remarks",
        type: "text",
        placeholder: "Masukkan Remarks",
      },
    ],
    [code, color]
  );

  const {
    control: transferControl,
    handleSubmit: handleTransferSubmit,
    setValue: setTransferValue,
    reset: transferReset,
    formState: { errors: transferErrors },
  } = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      input_date: "",
      bahan_baku: "",
      id_bahan_baku: 0,
      total_roll: "",
      total_yard: "",
      remarks: "",
    },
  });

  const transferFields = useMemo(
    () => [
      {
        name: "input_date",
        label: "Input Date",
        type: "date",
        placeholder: "Masukkan Input Date",
      },
      {
        name: "bahan_baku",
        label: "Bahan Baku",
        type: "text",
        placeholder: "Masukkan Bahan Baku",
        readOnly: true,
      },
      {
        name: "total_roll",
        label: `Total Roll: ${selectedTransferData?.total_roll}`,
        type: "number",
        placeholder: "Masukkan Total Roll",
      },
      {
        name: "total_yard",
        label: `Total Yard: ${selectedTransferData?.total_yard}`,
        type: "number",
        placeholder: "Masukkan Total Yard",
      },
      {
        name: "remarks",
        label: "Remarks",
        type: "text",
        placeholder: "Masukkan Remarks",
      },
    ],
    [selectedTransferData]
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
      id: item.id?.toString() || "-",
      Code: item?.code?.code || "-",
      Color: item?.color?.color || item?.id_color?.toString() || "-",
      Item: item.item || "-",
      "Total Roll": item.total_roll || 0,
      "Total Yard": item.total_yard || 0,
      "Cost per Yard": formatRupiah(item.cost_per_yard || 0),
      Remarks: item.remarks || "-",
    }));
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
    setSelectedData(null);
    reset();
  };

  const handleStock = () => {
    setIsStock(!isStock);
  };

  const handleSubmitForm: SubmitHandler<z.infer<typeof formSchema>> = async (
    formData
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        id_code: Number(formData.code),
        id_color: Number(formData.color),
        item: formData.item,
        remarks: formData.remarks,
        is_active: 1,
        id: selectedData?.id || 0,
        total_roll: selectedData?.total_roll || 0,
        total_yard: selectedData?.total_yard || 0,
        cost_per_yard: selectedData?.cost_per_yard || 0,
        code: {
          id: selectedData?.code?.id || 0, // Jika code sudah ada, ambil id-nya, jika tidak set default
          code: formData.code || "", // Gunakan nilai code yang ada dari formData
          remarks: formData.remarks || "", // Jika remarks diperlukan untuk code, berikan nilai default
          is_active: 1, // Jika perlu, berikan nilai aktif default
        },
        color: {
          id: selectedData?.color?.id || 0, // Jika color sudah ada, ambil id-nya, jika tidak set default
          color: formData.color || "", // Gunakan nilai color yang ada dari formData
          remarks: formData.remarks || "", // Jika remarks diperlukan untuk color, berikan nilai default
          is_active: 1,
        },
      };

      if (selectedData) {
        const response = await BahanBakuService.update(
          selectedData.id,
          payload
        );

        setData((prevData) =>
          prevData.map((item) =>
            item.id === selectedData.id
              ? { ...item, ...response.data.data }
              : item
          )
        );
        setIsLoading(false);
      } else {
        const response = await BahanBakuService.create(payload);
        setData((prevData) => [...prevData, response.data.data]);
      }

      handleModal();
      window.location.reload();
    } catch (error) {
      Swal.fire("Error!", "Gagal menyimpan data", "error");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: Record<string, string | number | boolean>) => {
    const fullData = data.find((d) => d.id?.toString() === item.id);
    if (!fullData) {
      console.log("Data tidak ditemukan");
      return;
    }

    setValue("code", fullData.id_code?.toString() || "");
    setValue("color", fullData.id_color?.toString() || "");
    setValue("item", fullData.item || "");
    setValue("remarks", fullData.remarks || "");

    setSelectedData(fullData);
    setIsOpen(true);
  };

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
      setIsLoading(true);

      try {
        await BahanBakuService.delete(item.id as number);

        const res = await BahanBakuService.getAll();
        setData(res.data.data);

        Swal.fire("Terhapus!", "Data color berhasil dihapus.", "success");
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data", "error");
        console.error("Delete error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTransfer = (item: Record<string, string | number | boolean>) => {
    const fullData = data.find((d) => d.id?.toString() === item.id);
    if (!fullData) {
      console.log("Data tidak ditemukan");
      return;
    }

    setTransferValue(
      "bahan_baku",
      fullData.code?.code +
        " - " +
        fullData.color?.color +
        " - " +
        fullData.item || ""
    );
    setTransferValue("id_bahan_baku", fullData.id || 0);
    setTransferValue("input_date", new Date().toISOString().split("T")[0]);

    setSelectedTransferData(fullData);

    setIsTransferOpen(true);

    window.location.reload();
  };

  const handleTransferForm: SubmitHandler<z.infer<typeof transferSchema>> = (
    data
  ) => {
    try {
      const payload = {
        id_bahan_baku: data.id_bahan_baku,
        outgoing_date: data.input_date,
        total_roll: Number(data.total_roll),
        total_yard: Number(data.total_yard),
        status: "cutting",
        remarks: data.remarks,
        is_active: 1,
      };

      console.log(payload);

      OutgoingBahanBakuService.create(payload);

      setSelectedTransferData(null);

      transferReset();

      setIsTransferOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions
        title="Inventory Bahan Baku"
        onAdd={handleModal}
        stock
        onStock={handleStock}
      />

      {isStock && <Stock onClose={handleStock} />}

      {isOpen && (
        <Cores.Modal
          title={selectedData ? "Edit Bahan Baku" : "Tambah Bahan Baku"}
          onClose={handleModal}
          key={selectedData?.id || "new"}
        >
          <Layouts.Form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Select Fields */}
              {fields.slice(0, 2).map((field) => (
                <div key={field.name}>
                  <Fragments.ControllerInput
                    {...field}
                    defaultValue={
                      selectedData?.[
                        field.name as keyof BahanBaku
                      ]?.toString() || ""
                    }
                    name={field.name as Path<z.infer<typeof formSchema>>}
                    control={control}
                    errors={errors}
                    options={field.options}
                  />
                </div>
              ))}

              {/* Text Fields */}
              {fields.slice(2).map((field) => (
                <div key={field.name} className="col-span-2">
                  <Fragments.ControllerInput
                    {...field}
                    control={control}
                    name={field.name as Path<z.infer<typeof formSchema>>}
                    defaultValue={
                      selectedData?.[
                        field.name as keyof BahanBaku
                      ]?.toString() || ""
                    }
                    errors={errors}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleModal}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                {isLoading ? <ClipLoader size={20} color="#fff" /> : "Simpan"}
              </button>
            </div>
          </Layouts.Form>
        </Cores.Modal>
      )}

      {isTransferOpen && (
        <Cores.Modal
          title="Transfer Bahan Baku Ke Tukang Potong"
          onClose={() => setIsTransferOpen(false)}
          key={selectedTransferData?.id || "transfer"}
        >
          <Layouts.Form onSubmit={handleTransferSubmit(handleTransferForm)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Form Transfer */}
              {transferFields.map((field) => (
                <div key={field.name} className="col-span-2">
                  <Fragments.ControllerInput
                    {...field}
                    control={transferControl}
                    readonly={field.readOnly}
                    name={field.name as Path<z.infer<typeof transferSchema>>}
                    errors={transferErrors}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsTransferOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Transfer
              </button>
            </div>
          </Layouts.Form>
        </Cores.Modal>
      )}

      {/* Table */}
      <section className="flex-1 p-4">
        <div className="bg-white rounded-lg border border-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <ClipLoader size={50} color="#007bff" />
            </div>
          ) : (
            <Cores.Table
              headers={headers}
              data={formatData(data)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              transfer={handleTransfer}
            />
          )}
        </div>
      </section>
    </Layouts.Main>
  );
};

export default InventoryBahanBaku;
