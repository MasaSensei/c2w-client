"use client";

import { useState } from "react";
import { Cores } from "@/components/core";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen overflow-y-auto bg-white text-sm flex flex-col border-r p-4 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="mb-8 flex items-center">
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <span className="text-2xl">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
            </svg>
          </span>
        </button>
        {!isCollapsed && (
          <h1
            className={cn(
              "text-xl font-bold ml-2 whitespace-nowrap overflow-hidden transition-all duration-300",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            C<span className="text-[12px] font-extrabold">2</span>W Dashboard
          </h1>
        )}
      </div>

      {/* Menu */}
      <nav>
        {!isCollapsed && (
          <h2
            className={cn(
              "mb-2 text-xs uppercase text-slate-400 whitespace-nowrap overflow-hidden transition-all duration-300",
              isCollapsed ? "w-0" : "w-auto"
            )}
          >
            Main Menu
          </h2>
        )}
        <ul>
          <li className="mb-2">
            <Cores.Button
              type="default"
              to="/suppliers"
              icon={
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 640 512"
                  className="mr-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"></path>
                </svg>
              }
            >
              {!isCollapsed && "Suppliers"}
            </Cores.Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
