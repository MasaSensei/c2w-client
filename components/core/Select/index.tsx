import {
  Select as ShadcnSelect,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectProps {
  onValueChange?: (e: string) => void;
  defaultValue?: string | number | undefined;
  children: React.ReactNode;
  placeholder: string;
}

const Select: React.FC<SelectProps> = ({
  onValueChange,
  defaultValue,
  children,
  placeholder,
}) => {
  return (
    <ShadcnSelect
      onValueChange={onValueChange}
      defaultValue={defaultValue?.toString()}
    >
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{placeholder}</SelectLabel>
          {children}
        </SelectGroup>
      </SelectContent>
    </ShadcnSelect>
  );
};

export default Select;
