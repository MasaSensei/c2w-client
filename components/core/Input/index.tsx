import { Input as ShadcnInput } from "@/components/ui/input";

interface InputProps {
  type: string;
  placeholder: string;
  onChange?: () => void;
  defaultValue?: string;
  min?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  onChange,
  defaultValue,
  min,
}) => {
  return (
    <ShadcnInput
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      min={min}
    />
  );
};

export default Input;
