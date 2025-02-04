import { Cores } from "@/components/core";

interface HeaderWithActionsProps {
  title: string;
  onFilter?: () => void;
  onAdd?: () => void;
  stock?: boolean;
  onStock?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const HeaderWithActions: React.FC<HeaderWithActionsProps> = ({
  title,
  onFilter,
  onAdd,
  stock,
  onStock,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-black">{title}</h1>
      <div className="flex items-center gap-2">
        {onFilter && (
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
        )}
        {onEdit && (
          <Cores.Button
            type="edit"
            className="bg-green-500 hover:bg-green-600"
            icon={
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 576 512"
                height="10"
                width="10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
              </svg>
            }
            onClick={onEdit}
          >
            Edit
          </Cores.Button>
        )}
        {onDelete && (
          <Cores.Button
            type="delete"
            className="bg-red-500 hover:bg-red-600"
            icon={
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="12"
                width="12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"></path>
              </svg>
            }
            onClick={onDelete}
          >
            Delete
          </Cores.Button>
        )}
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
        {onAdd && (
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
        )}
      </div>
    </div>
  );
};

export default HeaderWithActions;
