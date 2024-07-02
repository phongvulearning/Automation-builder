import React from "react";
import Sidebar from "@/app/components/sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="w-full">
        {/* <InfoBar /> */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
