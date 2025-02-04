"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

type ButtonProps = {
  type?:
    | "default"
    | "submenuParent"
    | "submenuChild"
    | "filter"
    | "add"
    | "delete"
    | "edit";
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  to?: string;
  childrenSubmenu?: ReactNode;
  isCollapsed?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  type = "default",
  icon,
  children,
  onClick,
  className = "",
  to,
  childrenSubmenu,
  isCollapsed,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = to && pathname === to;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (onClick) onClick();
    if (to) router.push(to);

    // Toggle submenu hanya untuk parent submenu
    if (type === "submenuParent" && !isCollapsed) {
      setIsOpen(!isOpen);
    }
  };

  // Styling button berdasarkan tipe
  const typeStyles = {
    default:
      "text-slate-500 bg-transparent hover:bg-green-600 hover:text-white",
    submenuParent:
      "text-slate-500 bg-transparent hover:bg-green-600 hover:text-white",
    submenuChild:
      "text-slate-500 text-justify px-4 bg-transparent hover:bg-green-600 hover:text-white",
    filter:
      "border border-gray-400 text-gray-600 py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs bg-white",
    add: "border border-white bg-green-500 text-white py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs",
    edit: "border border-white bg-green-500 text-white py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs",
    delete:
      "border border-white bg-red-500 text-white py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs",
  };

  const buttonClass = cn(
    `${
      !(type === "filter" || type === "add") && "w-full"
    } flex items-center shadow-none justify-start py-2 px-3 rounded-lg`,
    typeStyles[type] || typeStyles.default,
    isActive && "bg-green-500 shadow-md text-white",
    className
  );

  return (
    <>
      <ShadcnButton onClick={handleClick} className={buttonClass}>
        {icon && <span className="mr-2">{icon}</span>}
        <span className="text-sm mt-[0.5px] text-justify flex-1">
          {children}
        </span>
        {type === "submenuParent" && (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            className="ml-2"
            height="14"
            width="14"
          >
            <path
              d={
                isOpen
                  ? "M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                  : "M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
              }
            ></path>
          </svg>
        )}
      </ShadcnButton>
      {/* Render submenu jika isOpen */}
      {isOpen && childrenSubmenu && (
        <ul className="ml-6 mt-2 text-start">{childrenSubmenu}</ul>
      )}
    </>
  );
};

export default Button;
