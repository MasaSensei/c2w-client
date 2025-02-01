import { Cores } from "@/components/core";
import {
  Control,
  Controller,
  FieldValues,
  FieldErrors,
  Path,
  PathValue,
} from "react-hook-form";
import { useState } from "react";

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

interface Option {
  value: string;
  label: string;
}

const ControllerInput = <T extends FieldValues>(
  props: ControllerInputProps<T>
) => {
  const { name, placeholder, type, label, control, errors, defaultValue } =
    props;
  const [categories, setCategories] = useState<string[]>([""]);

  const handleAddCategory = () => setCategories([...categories, ""]);
  const handleRemoveCategory = (index: number) =>
    setCategories(categories.filter((_, i) => i !== index));

  return (
    <div className="text-start">
      <Cores.Label name={name}>{label}</Cores.Label>
      {type === "category" ? (
        <>
          {categories.map((_, index) => (
            <div key={index} className="flex items-center gap-4 mb-3">
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
              <button
                type="button"
                onClick={() => handleRemoveCategory(index)}
                className="text-xs font-semibold hover:opacity-50 transition duration-300"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCategory}
            className="mt-2 text-xs bg-primary text-white px-3 py-1.5 rounded hover:opacity-50 transition duration-300"
          >
            Add Category
          </button>
        </>
      ) : (
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
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-2">
          {errors[name]?.message as React.ReactNode}
        </p>
      )}
    </div>
  );
};

export default ControllerInput;
