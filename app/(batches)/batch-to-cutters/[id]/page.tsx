"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { Batch } from "@/types/batch";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BatchService } from "@/services/batch.service";

const ShowBatchToCuttersPage = () => {
  const [data, setData] = useState<Batch | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await BatchService.getOne(
          Number(pathname.split("/").pop())
        );
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData(null);
      }
    };

    fetchData();
  }, [pathname]);

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="Main Info Details" />
      <Layouts.SectionTable>
        <div className="mx-auto border rounded-lg bg-white px-5 py-4">
          <div className="text-sm flex items-start gap-8 rounded-t-lg mb-4">
            <p>
              <strong className="font-semibold">Batch No:</strong>{" "}
              {data?.batch_number}
            </p>
            <p>
              <strong className="font-semibold">Start Date:</strong>{" "}
              {data?.start_date}
            </p>
            <p>
              <strong className="font-semibold">End Date:</strong>{" "}
              {data?.end_date}
            </p>
            <p>
              <strong className="font-semibold">Status:</strong> {data?.status}
            </p>
            <p>
              <strong className="font-semibold">Remarks:</strong>{" "}
              {data?.remarks}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm">Batch Item:</h3>
            <div className="w-full relative bg-neutral-200 border border-gray-200 rounded">
              <div className=" w-fit min-w-full sm:flex sm:justify-center">
                <table className="min-w-full text-left text-[13px]">
                  <thead className="text-[13px] border-b bg-gray-100 text-black">
                    <tr>
                      <th
                        className="px-6 py-2 font-semibold text-center rounded-tl"
                        rowSpan={3}
                      >
                        Product Code
                      </th>
                      <th
                        className="px-6 py-2 font-semibold text-center border-x border-b"
                        colSpan={2}
                      >
                        Order Items
                      </th>
                    </tr>
                    <tr>
                      <th
                        className="px-6 py-2 font-semibold text-center border-x"
                        rowSpan={2}
                      >
                        Pre-selected
                      </th>
                      <th
                        className="px-6 py-2 font-semibold text-center border-x"
                        rowSpan={2}
                      >
                        Hasil Potong
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="">
                      <td
                        className="px-3 py-4 text-center align-top border-r font-semibold"
                        rowSpan={1}
                      >
                        {data?.details
                          ?.map((item) => item.product_code)
                          .join(", ")}
                      </td>
                      <td className="py-4 px-3 align-top border-x">
                        <div className="bg-gray-100 px-3 py-2 rounded-md">
                          <strong className="font-semibold">Quantity:</strong>{" "}
                          {data?.details?.map((item) => item.quantity)}
                          <br />
                          <strong className="font-semibold">
                            Pending Qty:
                          </strong>{" "}
                          2 pcs
                          <br />
                          <strong className="font-semibold">
                            Sudah Potong Qty:
                          </strong>{" "}
                          0 pcs
                        </div>
                      </td>
                      <td className="py-4 px-3 align-top border-x">
                        <div className="bg-gray-100 px-3 py-2 rounded-md mb-1">
                          <strong className="font-semibold">Quantity:</strong> 0
                          pcs
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Layouts.SectionTable>
    </Layouts.Main>
  );
};

export default ShowBatchToCuttersPage;
