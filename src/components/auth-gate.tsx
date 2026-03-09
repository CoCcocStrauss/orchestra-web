"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { TabBar } from "@/components/tab-bar";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";

  React.useEffect(() => {
    if (!user && !isLoginPage) {
      router.replace("/login");
    }
  }, [user, isLoginPage, router]);

  const shouldShowShell = true;

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex min-h-screen w-full max-w-md flex-col bg-white shadow-lg">
        <main
          className={`flex-1 overflow-y-auto px-4 pt-4 ${
            isLoginPage ? "pb-4" : "pb-20"
          }`}
        >
          {(!user && !isLoginPage) ? (
            <div className="flex h-full items-center justify-center text-xs text-zinc-400">
              正在前往登录页…
            </div>
          ) : (
            children
          )}
        </main>
        {!isLoginPage && user && <TabBar />}
      </div>
    </div>
  );
}

