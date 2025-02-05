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
import { SelectItem } from "@/components/ui/select";

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
  readonly?: boolean;
  currency?: boolean;
}

interface Option {
  value: string;
  label: string;
}

const ControllerInput = <T extends FieldValues>(
  props: ControllerInputProps<T>
) => {
  const {
    name,
    placeholder,
    type,
    label,
    control,
    errors,
    defaultValue,
    options,
    readonly,
    currency,
  } = props;
  const [categories, setCategories] = useState<string[]>([""]);

  const handleAddCategory = () => setCategories([...categories, ""]);
  const handleRemoveCategory = (index: number) =>
    setCategories(categories.filter((_, i) => i !== index));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="text-start">
      <Cores.Label name={name}>{label}</Cores.Label>
      {type === "category" ? (
        <>
          {categories.map((_, index) => (
            <div key={index} className="flex items-center gap-4 mb-3">
              <Controller
                name={`${name}.${index}` as Path<T>}
                control={control}
                defaultValue={defaultValue}
                render={({ field }: { field: FieldValues }) => (
                  <Cores.Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder={placeholder}
                  >
                    {options?.map((item: Option) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Cores.Select>
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
          render={({ field }: { field: FieldValues }) => (
            <>
              {type === "select" && options ? (
                <Cores.Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder={placeholder}
                >
                  {options?.map((item: Option) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Cores.Select>
              ) : (
                <Cores.Input
                  {...field}
                  placeholder={placeholder}
                  type={type}
                  defaultValue={defaultValue}
                  min={type === "number" ? "0" : undefined}
                  readOnly={readonly || false}
                  value={currency ? formatCurrency(field.value) : field.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let rawValue = e.target.value;

                    // Jika currency aktif, hapus karakter selain angka dan format ulang
                    if (currency) {
                      rawValue = rawValue.replace(/\D/g, ""); // Hanya angka
                    }

                    field.onChange(currency ? Number(rawValue) : rawValue);
                  }}
                />
              )}
            </>
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
