import { Cores } from "@/components/core";
import {
  Control,
  Controller,
  FieldValues,
  FieldErrors,
  Path,
  PathValue,
} from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface ControllerInputProps<T extends FieldValues> {
  name: Path<T>;
  placeholder: string;
  type: string;
  label: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  defaultValue?: PathValue<T, Path<T>>;
  options?: Option[];
  onClose?: () => void;
}

const ControllerInput = <T extends FieldValues>(
  props: ControllerInputProps<T>
) => {
  const { name, placeholder, type, label, control, errors, defaultValue } =
    props;

  return (
    <div className="lg:col-span-6">
      <div className="text-start">
        <Cores.Label name={name}>{label}</Cores.Label>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <Cores.Input
              {...field}
              placeholder={placeholder}
              type={type}
              defaultValue={defaultValue}
            />
          )}
        />
        {errors[name] && (
          <p className="text-red-500 text-sm mt-2">
            {errors[name]?.message as React.ReactNode}
          </p>
        )}
      </div>
    </div>
  );
};

export default ControllerInput;
