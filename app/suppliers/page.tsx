"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import axios from "axios";
import { useEffect, useState } from "react";

const SuppliersPage = () => {
  const [train, setTrain] = useState<any>([]);
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

  console.log(train);

  // // Fungsi untuk mengubah data sesuai dengan header
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

  return (
    <main className="h-full flex flex-col bg-neutral-300">
      <Fragments.HeaderWithActions
        title="Suppliers"
        onFilter={() => {}}
        onAdd={() => {}}
      />
      <section className="flex-1 p-4">
        <div className="bg-white border boder-gray-200 rounded-lg w-full relative">
          <div className="w-fit min-w-full sm:flex sm:justify-center">
            <Cores.Table headers={headers} data={formattedData} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SuppliersPage;
