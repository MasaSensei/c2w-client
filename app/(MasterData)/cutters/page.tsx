"use client";

import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { Worker } from "@/types/workers";
import { WorkerService } from "@/services/workers.service";

const CuttersPage = () => {
  const [data, setData] = useState<Worker[]>([]);

  useEffect(() => {
    WorkerService.getAll({ type: "cutters" })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error("Error fetching workers:", err));
  }, []);

  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="Cutters" onAdd={() => {}} />
    </Layouts.Main>
  );
};

export default CuttersPage;
