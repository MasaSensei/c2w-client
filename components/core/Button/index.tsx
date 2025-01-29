"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

type ButtonProps = {
  type?: "default" | "submenuParent" | "submenuChild" | "filter" | "add";
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  to?: string;
};

const Button: React.FC<ButtonProps> = ({
  type = "default",
  icon,
  children,
  onClick,
  className = "",
  to,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = to && pathname === to;

  const handleClick = () => {
    if (onClick) onClick();
    if (to) router.push(to);
  };

  // Konfigurasi styling berdasarkan tipe button
  const typeStyles = {
    default:
      "text-slate-500 bg-transparent hover:bg-green-600 hover:text-white",
    submenuParent: "text-slate-500 bg-transparent",
    submenuChild: "text-slate-500 bg-transparent",
    filter:
      "border border-gray-400 text-gray-600 py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs bg-white",
    add: "border border-white bg-green-500 text-white py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs",
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
    <ShadcnButton onClick={handleClick} className={buttonClass}>
      {icon && <span className="mr-2">{icon}</span>}
      <span className="text-sm mt-[0.5px] flex-1">{children}</span>
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
          <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
        </svg>
      )}
    </ShadcnButton>
  );
};

export default Button;
