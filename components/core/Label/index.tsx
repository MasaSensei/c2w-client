import { Label as ShadcnLabel } from "@/components/ui/label";

interface LabelProps {
  children: React.ReactNode;
  name: string;
}

const Label: React.FC<LabelProps> = (props) => {
  const { children, name } = props;
  return (
    <ShadcnLabel htmlFor={name} className="font-semibold">
      {children}
    </ShadcnLabel>
  );
};

export default Label;
