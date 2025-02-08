"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";

const BatchToCuttersPage = () => {
  const headers = [
    "Batch No",
    "Start Date",
    "End Date",
    "Total Items",
    "Status",
    "Remarks",
  ];
  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions
        title="Batch To Cutters"
        onAdd={() => {
          window.location.href = "/batch-to-cutters/create";
        }}
        stock={false}
      />
      <Layouts.SectionTable>
        <Cores.Table headers={headers} data={[]} />
      </Layouts.SectionTable>
    </Layouts.Main>
  );
};

export default BatchToCuttersPage;
