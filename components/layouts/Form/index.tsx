"use client";

import { Cores } from "@/components/core";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface Field {
  name: string;
  label: string;
  type: "text" | "select" | "password" | "email";
  options?: { value: string; label: string }[]; // Hanya untuk select
}

interface FormProps<T extends FieldValues> {
  fields: Field[];
  register: UseFormRegister<T>;
  errors: Partial<Record<keyof T, { message?: string }>>;
  onClose: () => void;
}

const Form = <T extends FieldValues>({
  fields,
  register,
  errors,
  onClose,
}: FormProps<T>) => {
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <Cores.InputFields
            label={field.label}
            type={field.type}
            {...register(field.name as Path<T>)} // register field here
            options={field.options}
          />
          {errors[field.name as keyof T]?.message && (
            <p className="text-red-500 text-sm">
              {errors[field.name as keyof T]?.message}
            </p>
          )}
        </div>
      ))}

      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={onClose}
          type="button"
          className="bg-gray-200 text-sm px-6 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white text-sm px-6 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Form;
