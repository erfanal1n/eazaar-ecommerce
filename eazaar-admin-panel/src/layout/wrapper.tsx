"use client";
import React, { useEffect,useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [sideMenu, setSideMenu] = useState<boolean>(false);
  useEffect(() => {
    const localAuth = Cookies.get("admin");
    if (!localAuth) {
      redirect("/login");
    }
  }, []);
  return (
    <ThemeProvider>
      <div className="tp-main-wrapper bg-slate-100 dark:bg-slate-900 h-screen transition-colors duration-300">
        <Sidebar sideMenu={sideMenu} setSideMenu={setSideMenu} />
        <div className="tp-main-content lg:ml-[250px] xl:ml-[300px] w-[calc(100% - 300px)]">
          {/* header start */}
          <Header setSideMenu={setSideMenu} />
          {/* header end */}

          {children}
        </div>
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
};

export default Wrapper;
