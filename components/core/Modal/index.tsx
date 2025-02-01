import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
  maxHeight?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  maxWidth,
  maxHeight,
  className,
}) => {
  return (
    <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card
        className={cn(
          " overflow-auto bg-white rounded-lg shadow-lg w-full relative",
          maxWidth ? `${maxWidth}` : "max-w-md",
          maxHeight ? `${maxHeight}` : "max-h-[92vh]",
          className
        )}
      >
        <CardHeader>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-dark hover:opacity-60 transition duration-300"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
            </svg>
          </button>
          <CardTitle className="text-2xl font-semibold mb-6">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default Modal;
