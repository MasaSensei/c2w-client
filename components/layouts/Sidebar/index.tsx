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
              type="submenuParent"
              icon={
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="mr-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M23 8c0 1.1-.9 2-2 2a1.7 1.7 0 0 1-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56A1.7 1.7 0 0 1 19 8c0-1.1.9-2 2-2s2 .9 2 2z"></path>
                </svg>
              }
              isCollapsed={isCollapsed}
              childrenSubmenu={
                <>
                  <li className="mb-2">
                    <Cores.Button type="submenuChild" to="/batch-to-cutters">
                      Batch To Cutters
                    </Cores.Button>
                  </li>
                </>
              }
            >
              {!isCollapsed && "Batches"}
            </Cores.Button>
          </li>
          <li className="mb-2">
            <Cores.Button
              type="submenuParent"
              icon={
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="mr-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M18 13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm3 5.5h-2.5V21h-1v-2.5H15v-1h2.5V15h1v2.5H21v1z"></path>
                  <path d="M11.69 15c.36-.75.84-1.43 1.43-2H7v-2h11c1.07 0 2.09.25 3 .69V5c0-1.1-.9-2-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6.69c-.44-.91-.69-1.93-.69-3 0-.34.03-.67.08-1H7v-2h4.69zM12 2.75c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM7 7h10v2H7V7z"></path>
                </svg>
              }
              isCollapsed={isCollapsed}
              childrenSubmenu={
                <>
                  <li className="mb-2">
                    <Cores.Button type="submenuChild" to="/cutters-assignments">
                      Cutters Assignments
                    </Cores.Button>
                  </li>
                </>
              }
            >
              {!isCollapsed && "Workers Assignment"}
            </Cores.Button>
          </li>
          <li className="mb-2">
            <Cores.Button
              type="submenuParent"
              icon={
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 576 512"
                  className="mr-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                </svg>
              }
              isCollapsed={isCollapsed}
              childrenSubmenu={
                <>
                  <li className="mb-2">
                    <Cores.Button type="submenuChild" to="/order-to-cutters">
                      Order To Cutters
                    </Cores.Button>
                  </li>
                </>
              }
            >
              {!isCollapsed && "Orders"}
            </Cores.Button>
          </li>
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
          <li className="mb-2">
            <Cores.Button
              type="default"
              to="/cutters"
              icon={
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 448 512"
                  className="mr-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M278.06 256L444.48 89.57c4.69-4.69 4.69-12.29 0-16.97-32.8-32.8-85.99-32.8-118.79 0L210.18 188.12l-24.86-24.86c4.31-10.92 6.68-22.81 6.68-35.26 0-53.02-42.98-96-96-96S0 74.98 0 128s42.98 96 96 96c4.54 0 8.99-.32 13.36-.93L142.29 256l-32.93 32.93c-4.37-.61-8.83-.93-13.36-.93-53.02 0-96 42.98-96 96s42.98 96 96 96 96-42.98 96-96c0-12.45-2.37-24.34-6.68-35.26l24.86-24.86L325.69 439.4c32.8 32.8 85.99 32.8 118.79 0 4.69-4.68 4.69-12.28 0-16.97L278.06 256zM96 160c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32zm0 256c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32z"></path>
                </svg>
              }
            >
              {!isCollapsed && "Tukang Potong"}
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
                  <li className="mb-2">
                    <Cores.Button type="submenuChild" to="/color">
                      Color
                    </Cores.Button>
                  </li>
                  <li className="mb-2">
                    <Cores.Button type="submenuChild" to="/models">
                      Model
                    </Cores.Button>
                  </li>
                  <li className="mb-2">
                    <Cores.Button type="submenuChild" to="/size">
                      Size
                    </Cores.Button>
                  </li>
                  <li className="mb-2">
                    <Cores.Button type="submenuChild" to="/category">
                      Bahan Kategori
                    </Cores.Button>
                  </li>
                </>
              }
            >
              {!isCollapsed && "Master Data"}
            </Cores.Button>
          </li>
          <li className="my-2">
            <Cores.Button
              type="submenuParent"
              isCollapsed={isCollapsed}
              icon={
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  className="mr-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"></path>
                </svg>
              }
              childrenSubmenu={
                <>
                  <li className="mb-2">
                    <Cores.Button
                      type="submenuParent"
                      isCollapsed={isCollapsed}
                      childrenSubmenu={
                        <>
                          <li className="mb-2">
                            <Cores.Button
                              type="submenuChild"
                              to="/inventory-bahan-baku"
                            >
                              Inventory Bahan Baku
                            </Cores.Button>
                          </li>
                          <li className="mb-2">
                            <Cores.Button
                              type="submenuChild"
                              to="/inventory-bahan-baku/incoming"
                            >
                              Incoming Bahan Baku
                            </Cores.Button>
                          </li>
                          <li className="mb-2">
                            <Cores.Button
                              type="submenuChild"
                              to="/inventory-bahan-baku/to-cutters"
                            >
                              Inventory To Cutters
                            </Cores.Button>
                          </li>
                          <li className="mb-2">
                            <Cores.Button
                              type="submenuChild"
                              to="/inventory-bahan-baku/outgoing"
                            >
                              Outgoing Bahan Baku
                            </Cores.Button>
                          </li>
                        </>
                      }
                    >
                      {!isCollapsed && "Bahan Baku"}
                    </Cores.Button>
                  </li>
                </>
              }
            >
              {!isCollapsed && "Inventory"}
            </Cores.Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
