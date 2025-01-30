import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Option {
  value: string;
  label: string;
}

interface InputFieldProps {
  name: string;
  label: string;
  type?: "text" | "select" | "password" | "email";
  value?: string | number;
  defaultValue?: string | number;
  onChange?: () => void;
  options?: Option[];
}

const InputFields: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  value,
  name,
  defaultValue,
  onChange,
  options,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      {type === "select" ? (
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={value || ""}
          onChange={onChange}
        >
          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={type}
          name={name}
          defaultValue={defaultValue}
          onChange={onChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      )}
    </div>
  );
};

export default InputFields;
