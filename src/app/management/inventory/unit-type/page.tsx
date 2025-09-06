"use client";
// app/inventory/page.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UnitTable } from "@/components/UnitTable";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UnitPage() {
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
        <div className="w-full">
          <div className="h-screen bg-gray-100 flex flex-col">
            <Header user={user}></Header>
            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Menu Grid */}
              <div className="flex-1 overflow-auto">
                <UnitTable />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
