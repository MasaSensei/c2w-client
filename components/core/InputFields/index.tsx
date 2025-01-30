import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Option {
  value: string;
  label: string;
}

interface InputFieldProps {
  id: string;
  label: string;
  type?: "text" | "select" | "password" | "email";
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  required?: boolean;
  options?: Option[];
}

const InputFields: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  options,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      {type === "select" ? (
        <select
          id={id}
          name={id}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={value}
          onChange={onChange}
          required={required}
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
          id={id}
          name={id} // pastikan `name` ada di input supaya formData bisa diupdate
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

export default InputFields;
