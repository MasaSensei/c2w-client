const StepNavigation = ({
  steps,
  activeTab,
  setActiveTab,
}: {
  steps: { id: number; label: string }[];
  activeTab: number;
  setActiveTab: (id: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center justify-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab(step.id)}
          >
            <button
              type="button"
              className={`rounded-full transition duration-500 ease-in-out h-6 w-6 text-sm flex items-center justify-center ${
                activeTab === step.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {step.id}
            </button>
            <div>
              <span
                className={`text-sm whitespace-nowrap ${
                  activeTab === step.id ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="w-full flex items-center justify-center">
              <div className="h-0.5 w-[72px] bg-gray-400"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepNavigation;
