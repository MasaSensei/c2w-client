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
                  viewBox="0 0 640 512"
                  className="mr-2"
                  height="1em"
                  width="1em"
                >
                  <path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"></path>
                </svg>
              }
            >
              {!isCollapsed && "Suppliers"}
            </Cores.Button>
          </li>
          <hr />
          <li className="my-2">
            <Cores.Button
              type="submenuParent"
              icon={
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3"></path>
                  <path d="M4 6v6c0 1.657 3.582 3 8 3c.21 0 .42 -.003 .626 -.01"></path>
                  <path d="M20 11.5v-5.5"></path>
                  <path d="M4 12v6c0 1.657 3.582 3 8 3"></path>
                  <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                  <path d="M19.001 15.5v1.5"></path>
                  <path d="M19.001 21v1.5"></path>
                  <path d="M22.032 17.25l-1.299 .75"></path>
                  <path d="M17.27 20l-1.3 .75"></path>
                  <path d="M15.97 17.25l1.3 .75"></path>
                  <path d="M20.733 20l1.3 .75"></path>
                </svg>
              }
              isCollapsed={isCollapsed}
              childrenSubmenu={
                <>
                  <li className="mb-2">
                    <Cores.Button type="submenuChild" to="/code">
                      Kode
                    </Cores.Button>
                  </li>
                </>
              }
            >
              {!isCollapsed && "Master Data"}
            </Cores.Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
