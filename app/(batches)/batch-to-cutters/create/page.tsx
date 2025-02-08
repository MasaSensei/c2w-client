"use client";

import { Fragments } from "@/components/fragments";
import { Layouts } from "@/components/layouts";

const CreateBatchToCuttersPage = () => {
  return (
    <Layouts.Main>
      <Fragments.HeaderWithActions title="Create Batch To Cutters" />
      <section className="flex-1 overflow-auto">
        <div className="mt-6 mb-8 max-w-lg mx-auto">
          <div className="relative">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full transition duration-500 ease-in-out h-6 w-6 text-sm flex items-center justify-center bg-green-600 text-white"
                  >
                    1
                  </button>
                  <div>
                    <span className="text-sm whitespace-nowrap text-green-600">
                      Main Info
                    </span>
                  </div>
                </div>
                <div className="w-full flex items-center justify-center">
                  <div className="h-0.5 w-[72px] bg-gray-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layouts.Main>
  );
};

export default CreateBatchToCuttersPage;
