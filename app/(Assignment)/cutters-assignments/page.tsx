"use client";

import { Cores } from "@/components/core";
import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useState } from "react";
import AssignWorkerCuttersAssignment from "./stock";

const CuttersAssignmentPage = () => {
  const [isAdding, setIsAdding] = useState(false);
  const handleAdd = () => {
    setIsAdding(!isAdding);
  };
  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions
        title="Cutters Assignment"
        onAdd={handleAdd}
      />
      {isAdding && <AssignWorkerCuttersAssignment onClose={handleAdd} />}
      <Layouts.SectionTable>
        <Cores.Table
          headers={["Assign Date", "Worker", "Order No"]}
          data={[]}
        />
      </Layouts.SectionTable>
    </Layouts.Main>
  );
};

export default CuttersAssignmentPage;
