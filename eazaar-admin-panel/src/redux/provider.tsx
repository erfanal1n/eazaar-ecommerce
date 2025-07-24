"use client";
import { ToastContainer } from "react-toastify";
import { store } from "./store";
import { Provider } from "react-redux";
import AuthCom from "@/app/components/auth/auth-com";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider>
          <AuthCom>{children}</AuthCom>
          <ToastContainer />
        </ThemeProvider>
      </Provider>
    </>
  );
}
