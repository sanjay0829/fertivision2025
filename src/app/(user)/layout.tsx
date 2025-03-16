import Navbar from "@/components/navbar";
import React from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="w-full bg-gradient-to-tr from-amber-100 via-sky-100 to-violet-50 min-h-screen flex items-center justify-center ">
      <div className="w-full min-h-[98vh] max-w-6xl   mx-auto  shadow-lg shadow-neutral-400 bg-slate-100 mt-1 rounded-md  ">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
