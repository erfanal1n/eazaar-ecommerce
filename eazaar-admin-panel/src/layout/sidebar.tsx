"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import sidebar_menu from "@/data/sidebar-menus";
import { DownArrow } from "@/svg";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/redux/auth/authSlice";
import { useRouter, usePathname } from "next/navigation";
import ResponsiveLogo from "@/app/components/common/responsive-logo";

// prop type
type IProps = {
  sideMenu: boolean;
  setSideMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({sideMenu,setSideMenu}:IProps) {
  const [isDropdown, setIsDropDown] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { hasAnyPermission, userRole } = usePermissions();

  // Check if current path matches menu item
  const isActiveLink = (link: string) => {
    return pathname === link;
  };

  // Check if any submenu is active
  const hasActiveSubmenu = (menu: any) => {
    if (!menu.subMenus) return false;
    return menu.subMenus.some((sub: any) => pathname === sub.link);
  };

  // Auto-open dropdown if submenu is active
  useEffect(() => {
    const activeMenu = sidebar_menu.find(menu => hasActiveSubmenu(menu));
    if (activeMenu) {
      setIsDropDown(activeMenu.title);
    }
  }, [pathname]);

  // handle active menu
  const handleMenuActive = (title: string) => {
    if (title === isDropdown) {
      setIsDropDown("");
    } else {
      setIsDropDown(title);
    }
  };

   // handle logout
   const handleLogOut = () => {
    dispatch(userLoggedOut());
    router.push(`/login`);
  };
  return (
    <>
      <aside
        className={`w-[300px] lg:w-[250px] xl:w-[300px] border-r border-gray dark:border-slate-700 overflow-y-auto sidebar-scrollbar fixed left-0 top-0 h-full bg-white dark:bg-slate-800 z-50 transition-all duration-300 ${sideMenu? "translate-x-[0px]" : " -translate-x-[300px] lg:translate-x-[0]"}`}
      >
        <div className="flex flex-col justify-between h-full">
          <div >

            <div className="px-2 sm:px-3 md:px-4 border-b border-gray dark:border-slate-700 h-[90px] sm:h-[100px] md:h-[110px] lg:h-[120px] flex items-center justify-center">
              <ResponsiveLogo 
                href="/dashboard"
                priority={true}
                className="w-full max-w-[90%]"
              />
            </div>
            <div className="px-4 py-5">
              <ul>
                {sidebar_menu.filter(menu => {
                  // Always show dashboard and online store
                  if (menu.link === "/dashboard" || menu.title === "Online store") return true;
                  
                  // If no user role loaded yet, hide all except dashboard (loading state)
                  if (!userRole) return false;
                  
                  // Super Admin sees everything
                  if (userRole === "Super Admin") return true;
                  
                  // Check if user has permission for this menu
                  if (menu.subMenus) {
                    // For menus with submenus, show if user has permission for any submenu
                    return menu.subMenus.some((sub: any) => hasAnyPermission(sub.link));
                  } else {
                    // For single menus, check direct permission
                    return hasAnyPermission(menu.link);
                  }
                }).map((menu) => (
                  <li key={menu.id}>
                    {!menu.subMenus && menu.title !== 'Online store' && (
                      <Link
                        href={menu.link}
                        onClick={() => handleMenuActive(menu.title)}
                        className={`group rounded-md relative text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 sidebar-link-active ${
                          isActiveLink(menu.link) 
                            ? 'bg-themeLight text-theme dark:bg-slate-700 dark:text-theme' 
                            : 'text-black dark:text-white hover:bg-gray dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="inline-block mr-[10px] text-xl">
                          <menu.icon />
                        </span>
                        {menu.title}

                        {menu.subMenus && (
                          <span className="absolute right-4 top-[52%] transition-transform duration-300 origin-center w-4 h-4">
                            <DownArrow />
                          </span>
                        )}
                      </Link>
                    )}
                    {menu.subMenus && (
                      <a
                        onClick={() => handleMenuActive(menu.title)}
                        className={`group cursor-pointer rounded-md relative text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 sidebar-link-active ${
                          isDropdown === menu.title || hasActiveSubmenu(menu)
                            ? "bg-themeLight hover:bg-themeLight text-theme dark:bg-slate-700 dark:text-theme" 
                            : "text-black dark:text-white hover:bg-gray dark:hover:bg-slate-700"
                        }`}
                      >
                        <span className="inline-block mr-[10px] text-xl">
                          <menu.icon />
                        </span>
                        {menu.title}

                        {menu.subMenus && (
                          <span className="absolute right-4 top-[52%] transition-transform duration-300 origin-center w-4 h-4">
                            <DownArrow />
                          </span>
                        )}
                      </a>
                    )}
                    {menu.title === 'Online store' && (
                      <a
                        href="http://localhost:3000"
                        target="_blank"
                        className={`group cursor-pointer rounded-md relative text-black dark:text-white text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 hover:bg-gray dark:hover:bg-slate-700 sidebar-link-active`}
                      >
                        <span className="inline-block mr-[10px] text-xl">
                          <menu.icon />
                        </span>
                        {menu.title}
                      </a>
                    )}

                    {menu.subMenus && (
                      <ul
                        className={`pl-[42px] pr-[20px] pb-3 ${isDropdown === menu.title ? "block" : "hidden"}`}
                      >
                        {menu.subMenus.filter((sub: any) => {
                          // Super Admin sees everything
                          if (userRole === "Super Admin") return true;
                          // Others need permission
                          return hasAnyPermission(sub.link);
                        }).map((sub, i) => (
                          <li key={i}>
                            <Link
                              href={sub.link}
                              className={`block font-normal w-full nav-dot transition-colors duration-300 ${
                                isActiveLink(sub.link)
                                  ? 'text-theme font-medium'
                                  : 'text-[#6D6F71] dark:text-slate-400 hover:text-theme'
                              }`}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-center mb-6">
            <button onClick={handleLogOut} className="tp-btn px-7 py-2">Logout</button>
          </div>
        </div>
      </aside>

      <div
        onClick={() => setSideMenu(!sideMenu)}
        className={`fixed top-0 left-0 w-full h-full z-40 bg-black/70 transition-all duration-300 ${sideMenu ? "visible opacity-1" : "  invisible opacity-0 "}`}
      >
        {" "}
      </div>
    </>
  );
}