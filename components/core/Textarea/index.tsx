import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";

const Textarea = ({
  placeholder,
  defaultValue,
  name,
}: {
  placeholder: string;
  defaultValue?: string;
  name: string;
}) => {
  return (
    <ShadcnTextarea
      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-dark"
      rows={4}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
};

export default Textarea;
