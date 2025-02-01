import { Input as ShadcnInput } from "@/components/ui/input";

interface InputProps {
  type: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  min?: string;
  value?: string;
  readOnly?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  defaultValue,
  min,
  readOnly,
}) => {
  return (
    <ShadcnInput
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      className={`px-3 ${
        readOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"
      } py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
      min={min}
      value={value}
      readOnly={readOnly}
    />
  );
};

export default Input;
