"use client";

import { TableEntity } from "@/types/pos";
import { useEffect, useState } from "react";

import { Header } from "@/components/header";
import UserTable from "@/components/UserTable";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const { user, isLoading, fetchUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchUser().then(() => {
      if (!useAuthStore.getState().user) {
        router.push('/');
      }
    });
  }, [fetchUser, router]);

  return (
    <div>
      <SidebarProvider
        style={{
          // @ts-ignore
          "--sidebar-width": "10rem",
          "--sidebar-width-mobile": "20rem",
        }}
      >
        <AppSidebar />
        <div className="w-full h-screen">
          <div className="h-screen bg-gray-100 flex flex-col">
            <Header user={user}></Header>
            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Menu Grid */}
              <div className="flex-1 overflow-auto">
                <UserTable />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
