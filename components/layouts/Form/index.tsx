"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Cores } from "@/components/core";

interface Field {
  name: string;
  label: string;
  type: "text" | "select" | "password" | "email";
  required?: boolean;
  options?: { value: string; label: string }[]; // Hanya untuk tipe 'select'
}

type FormData = {
  [key: string]: string; // Misalnya, data yang dikirim adalah string
};

interface FormProps {
  fields: Field[];
  formSchema: z.ZodSchema;
  onSubmit: (data: FormData) => void;
  onClose: () => void;
  initialData?: FormData;
}

const Form: React.FC<FormProps> = ({
  fields,
  formSchema,
  onSubmit,
  onClose,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const onSubmitHandler = (data: FormData) => {
    console.log("Form Data:", data);
    onSubmit(data);
  };

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmitHandler)}>
      {fields.map((field) => (
        <Cores.InputFields
          key={field.name}
          id={field.name}
          label={field.label}
          value={initialData ? initialData[field.name] : ""}
          type={field.type}
          {...register(field.name)} // Mendaftarkan input untuk react-hook-form
          required={field.required}
          options={field.options}
        />
      ))}

      {Object.keys(errors).length > 0 && (
        <div className="text-red-500 text-sm">
          {Object.values(errors).map((err, index) => (
            <p key={index}>{err?.message}</p>
          ))}
        </div>
      )}

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
    </form>
  );
};

export default Form;
