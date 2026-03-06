import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "sonner";
import { Navbar } from "./components/Navbar";

export function Root() {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <Outlet />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontFamily: "inherit",
            fontSize: "0.875rem",
          },
        }}
      />
    </>
  );
}
