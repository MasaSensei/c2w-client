import { Cores } from "@/components/core";

interface HeaderWithActionsProps {
  title: string;
  onFilter?: () => void;
  onAdd?: () => void;
  stock?: boolean;
  onStock?: () => void;
}

const HeaderWithActions: React.FC<HeaderWithActionsProps> = ({
  title,
  onFilter,
  onAdd,
  stock,
  onStock,
}) => {
  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-black">{title}</h1>
      <div className="flex items-center gap-2">
        <Cores.Button
          type="filter"
          className="hover:text-white"
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="12"
              width="12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M472 168H40a24 24 0 0 1 0-48h432a24 24 0 0 1 0 48zm-80 112H120a24 24 0 0 1 0-48h272a24 24 0 0 1 0 48zm-96 112h-80a24 24 0 0 1 0-48h80a24 24 0 0 1 0 48z"></path>
            </svg>
          }
          onClick={onFilter}
        >
          Filter
        </Cores.Button>
        {stock && (
          <Cores.Button
            type="add"
            className="bg-orange-500 hover:bg-orange-600"
            icon={
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="14"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z"></path>
              </svg>
            }
            onClick={onStock}
          >
            Stock
          </Cores.Button>
        )}
        <Cores.Button
          type="add"
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z"></path>
            </svg>
          }
          onClick={onAdd}
        >
          Add New
        </Cores.Button>
      </div>
    </div>
  );
};

export default HeaderWithActions;
