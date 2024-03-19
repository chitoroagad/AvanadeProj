"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { useAuth } from "./utils/hooks";
import { AuthContext } from "./utils/contexts";
import MainTab from "./components/MainTab";
import { usePathname } from "next/navigation";
// import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

// isnt allowed for client components.

// export const metadata: Metadata = {
//   title: 'JurisBUD AI',
//   description: 'Developed by UCL Computer Science 23-24 Team 5',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuth, setIsAuth, username, setUsername] = useAuth();
  const showMainTab = isAuth && pathname != "/Home";
  useEffect(() => {
    console.log("render");
    console.log(pathname);
  }, []);

  return (
    <html>
      <body
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {showMainTab && <MainTab />}
        <div
          style={{
            width: "100%",
          }}
        >
          <AuthContext.Provider
            value={{ isAuth, setIsAuth, username, setUsername }}
          >
            {children}
          </AuthContext.Provider>
        </div>
      </body>
    </html>
  );
}
