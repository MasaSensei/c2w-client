"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

interface Field {
  name: string;
  label: string;
  type: "text" | "select" | "password" | "email";
  required?: boolean;
  options?: { value: string; label: string }[];
}

const SuppliersPage = () => {
  const [train, setTrain] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const headers = [
    "Train ID",
    "Destination Station",
    "Departure Time",
    "Arrival Time",
  ];

  useEffect(() => {
    const response = axios.get(`https://api.comuline.com/v1/schedule/kpb`);
    response.then((res) => {
      setTrain(res.data.data);
    });
  }, []);

  const fields: Field[] = [
    {
      name: "train_id", // Sesuaikan dengan nama properti dari API
      label: "Train ID",
      type: "text",
      required: true,
    },
    {
      name: "station_destination_id", // Sesuaikan dengan nama properti dari API
      label: "Destination Station",
      type: "text",
      required: true,
    },
    {
      name: "departs_at", // Sesuaikan dengan nama properti dari API
      label: "Departure Time",
      type: "text",
      required: true,
    },
    {
      name: "arrives_at", // Sesuaikan dengan nama properti dari API
      label: "Arrival Time",
      type: "text",
      required: true,
    },
    {
      name: "remarks", // Ini bisa ditambahkan sesuai kebutuhan, misalnya 'remarks'
      label: "Remarks",
      type: "text",
    },
  ];

  const formSchema = z.object({
    train_id: z.string(),
    station_destination_id: z.string(),
    departs_at: z.string(),
    arrives_at: z.string(),
  });

  const formatData = (data: any) => {
    return data?.map((item: any) => {
      return headers.reduce((acc, header) => {
        switch (header) {
          case "Train ID":
            acc[header] = item.train_id;
            break;
          case "Destination Station":
            acc[header] = item.station_destination_id;
            break;
          case "Departure Time":
            acc[header] = item.departs_at;
            break;
          case "Arrival Time":
            acc[header] = item.arrives_at;
            break;
          default:
            acc[header] = item[header.toLowerCase()];
        }
        return acc;
      }, {} as { [key: string]: string });
    });
  };

  const formattedData = formatData(train);

  const handleModal = () => {
    setIsOpen(!isOpen);
    setSelectedData(null);
  };

  const handleSubmitForm = (data: any) => {
    console.log("Form submitted with data:", data);
  };

  const handleEdit = (data: any) => {
    console.log("Edit data:", data);
    setSelectedData({
      train_id: data["Train ID"],
      station_destination_id: data["Destination Station"],
      departs_at: data["Departure Time"],
      arrives_at: data["Arrival Time"],
      remarks: data["Remarks"] || "-", // Sesuaikan jika ada field lain
    });
    setIsOpen(true);
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
          <Layouts.Form
            onSubmit={handleSubmitForm}
            formSchema={formSchema}
            onClose={handleModal}
            fields={fields}
            initialData={selectedData}
          />
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
